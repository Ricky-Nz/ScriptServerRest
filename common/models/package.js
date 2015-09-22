var restApiFilter = require('../restApiFilter');

module.exports = function (Package) {
	restApiFilter(Package, ['findById', 'updateAttributes', 'deleteById']);
};
