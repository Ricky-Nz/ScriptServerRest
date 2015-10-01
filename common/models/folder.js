var restApiFilter = require('../restApiFilter'),
	_ = require('underscore');

module.exports = function (Folder) {
	restApiFilter(Folder, [
		'create',
		'findById',
		'updateAttributes',
		'deleteById',
		'__get__scripts',
		'__updateById__scripts',
		'__destroyById__scripts',
		'__findById__scripts',
		'__create__scripts',
		'__count__scripts'
	]);

	Folder.beforeRemote('create', function (context, data, next) {
		context.req.body.date = new Date();
		context.req.body.testerId = context.req.accessToken.userId;
		next();
	});

	Folder.beforeRemote('prototype.updateAttributes', function (context, data, next) {
		context.req.body.date = new Date();
		next();
	});

	Folder.beforeRemote('prototype.__create__scripts', function (context, data, next) {
		context.req.body.date = new Date();
		context.req.body.folderId = context.instance.id;
		next();
	});

	Folder.beforeRemote('prototype.__updateById__scripts', function (context, data, next) {
		context.req.body.date = new Date();
		next();
	});

	Folder.afterRemote('prototype.__get__scripts', function (context, data, next) {
		context.instance.__count__scripts(function (err, total) {
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
	});
};