var hideAttributes = require('../hideAttributes');

module.exports = function (Package) {
	hideAttributes.forEach(function (item) {
		Package.disableRemoteMethod(item.name, item.static);
	});

};
