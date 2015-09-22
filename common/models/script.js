var restApiFilter = require('../restApiFilter');

module.exports = function (Script) {
	restApiFilter(Script, ['create', 'findById', 'deleteById', '__get__scripts']);
};
