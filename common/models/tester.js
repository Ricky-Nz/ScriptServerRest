var debug = require('debug'),
	log = debug('app:log'),
	error = debug('app:error'),
	restApiFilter = require('../restApiFilter'),
	_ = require('underscore'),
	path = require('path'),
	fs = require('fs');

module.exports = function(Tester) {
	restApiFilter(Tester, [
		'login',
		'logout',
		'create',
		'findById',
		'deleteById',
		'updateAttributes',
		'__create__scripts',
		'__create__parameters',
		'__create__reports',
		'__get__scripts',
		'__get__parameters',
		'__get__packages',
		'__get__reports',
		'__updateById__scripts',
		'__updateById__parameters',
		'__destroyById__scripts',
		'__destroyById__parameters',
		'__destroyById__packages',
		'__destroyById__reports',
		'__findById__scripts',
		'__count__scripts',
		'__count__parameters',
		'__count__packages',
		'__count__reports'
	]);

	function countTotalItems (context, countMethod, next) {
		var where = null;
		if (context.args.filter) {
			where = JSON.parse(context.args.filter).where;
		}
		context.instance[countMethod](where, function (err, total) {
			var result = {
				total: total,
				data: context.result
			};
			if (context.req.query.filter) {
				var query = JSON.parse(context.req.query.filter);
				_.extend(result, {skip: query.skip ? query.skip + query.limit : query.limit});
			}

			context.result = result;
			next();
		});
	}

	Tester.beforeRemote('prototype.*', function (context, data, next) {
		if (context.args.data) {
			context.args.data.date = new Date();
		}
		
		next();
	});

	Tester.beforeRemote('prototype.__destroyById__packages', function (context, data, next) {
		Tester.app.models.Package.findById(context.args.fk, function (err, package) {
			if (err) return next(err);

			Tester.app.models.Container.removeFile(package.testerId.toString(), package.fileName, function (err, result) {
				next();
			});
		});
	});

	Tester.afterRemote('prototype.__get__packages', function (context, data, next) {
		countTotalItems(context, '__count__packages', next);
	});

	Tester.afterRemote('prototype.__get__parameters', function (context, data, next) {
		countTotalItems(context, '__count__parameters', next);
	});

	Tester.afterRemote('prototype.__get__reports', function (context, data, next) {
		countTotalItems(context, '__count__reports', next);
	});

	Tester.afterRemote('prototype.__get__scripts', function (context, data, next) {
		countTotalItems(context, '__count__scripts', next);
	});
	
	Tester.afterRemote('login', function (context, data, next) {
		context.result.email = context.req.body.email;
		context.result.config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'custom-config.json')));
		next();
	});

	Tester.getTags = function (context, req, res, cb) {
		Tester.app.models.Script.find({
			where: {
				testerId: req.accessToken.userId
			},
			fields: {
				tags: true
			}
		}, function (err, scrips) {
			var nestedArray = _.map(scrips, function (script) {
				return script.tags;
			})
			cb(err, _.union(_.flatten(nestedArray)));
		});
	};

	Tester.remoteMethod('getTags', {
		description: 'get all script tags which owned by this user',
		accepts: [
			{arg: 'context', type: 'object', 'http': {source: 'context'}},
			{arg: 'req', type: 'object', 'http': {source: 'req'}},
			{arg: 'res', type: 'object', 'http': {source: 'res'}}
		],
		returns: { arg: 'tags', type: 'array' },
		http: {
			path: '/tags',
			verb: 'get'
		}
	});

	Tester.reverify = function (email, cb) {
		Tester.findOne({email: email})
			.then(function (err, tester) {
				if (err) throw err;

				var options = {
					type: 'email',
					to: email,
					from: 'ruiqi.newzealand@gmail.com',
					subject: 'Thanks for registering',
					redirect: '/',
					user: tester
				};

				return tester.verify(options);
			})
			.then(function (err, response) {
				if (err) throw err;

				cb(null, true);
			})
			.catch(function (err) {
				cb(err);
			});
	};

	Tester.remoteMethod('reverify', {
		description: 'Rend send verification email.',
		accepts: { arg: 'email', type: 'string' },
		returns: { arg: 'result', type: 'bool'}
	});
};
