var restApiFilter = require('../restApiFilter');

module.exports = function (Report) {
	restApiFilter(Report, ['create', 'findById', 'updateAttributes', 'deleteById']);
};
