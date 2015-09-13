var hideAttributes = require('../hideAttributes');

module.exports = function (Report) {
	hideAttributes.forEach(function (item) {
		Report.disableRemoteMethod(item.name, item.static);
	});
};
