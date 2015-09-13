var hideAttributes = require('../hideAttributes');

module.exports = function (Script) {
	hideAttributes.forEach(function (item) {
		Script.disableRemoteMethod(item.name, item.static);
	});
	
	Script.observe('before save', function (context, next) {
		context.instance.date = Date.now();
		next();
	});
};
