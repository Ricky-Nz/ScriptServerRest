var hideAttributes = require('../hideAttributes');

module.exports = function (Parameter) {
	hideAttributes.forEach(function (item) {
		Parameter.disableRemoteMethod(item.name, item.static);
	});

};
