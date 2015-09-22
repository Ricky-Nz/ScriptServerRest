var restApiFilter = require('../restApiFilter');

module.exports = function (Folder) {
	restApiFilter(Folder, ['create', 'findById', 'updateAttributes', 'deleteById', '__get__scripts']);

	Folder.beforeRemote('create', function (context, data, next) {
		context.req.body.date = new Date();
		context.req.body.testerId = context.req.accessToken.userId;
		next();
	});

	Folder.beforeRemote('prototype.updateAttributes', function (context, data, next) {
		context.req.body.date = new Date();
		next();
	});
};