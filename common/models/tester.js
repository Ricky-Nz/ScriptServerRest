var debug = require('debug'),
	log = debug('app:log'),
	error = debug('app:error'),
	restApiFilter = require('../restApiFilter'),
	_ = require('underscore');

module.exports = function(Tester) {
	restApiFilter(Tester, ['create', 'findById', 'deleteById', '__get__folders', '__get__packages', '__get__parameters', '__get__reports', 'login', 'logout']);

	function countTotalItems (context, countMethod, next) {
		context.instance[countMethod](function (err, total) {
			var result = {
				total: total,
				data: context.result
			};
			if (context.req.query.filter) {
				_.extend(result, JSON.parse(context.req.query.filter));
			}

			context.result = result;
			next();
		});
	}

	Tester.afterRemote('prototype.__get__folders', function (context, data, next) {
		countTotalItems(context, '__count__folders', next);
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
