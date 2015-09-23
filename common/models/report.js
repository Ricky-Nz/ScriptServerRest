var restApiFilter = require('../restApiFilter');

module.exports = function (Report) {
	restApiFilter(Report, ['create', 'findById', 'deleteById']);

	Report.beforeRemote('create', function (context, data, next) {
		context.req.body.date = new Date();
		context.req.body.testerId = context.req.accessToken.userId;
		next();
	});

	Report.beforeRemote('prototype.updateAttributes', function (context, data, next) {
		context.req.body.date = new Date();
		next();
	});
};
