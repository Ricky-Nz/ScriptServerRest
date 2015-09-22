var restApiFilter = require('../restApiFilter');

module.exports = function (Parameter) {
	restApiFilter(Parameter, ['create', 'findById', 'updateAttributes', 'deleteById']);
};
