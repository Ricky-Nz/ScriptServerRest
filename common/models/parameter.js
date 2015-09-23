var restApiFilter = require('../restApiFilter');

module.exports = function (Parameter) {
	restApiFilter(Parameter, ['create', 'findById', 'updateAttributes', 'deleteById']);

	Parameter.beforeRemote('create', function (context, data, next) {
		context.req.body.date = new Date();
		context.req.body.testerId = context.req.accessToken.userId;
		next();
	});

	Parameter.beforeRemote('prototype.updateAttributes', function (context, data, next) {
		context.req.body.date = new Date();
		next();
	});
};
