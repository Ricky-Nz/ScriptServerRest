var hideAttributes = require('../hideAttributes');

module.exports = function (Folder) {
	hideAttributes.forEach(function (item) {
		Folder.disableRemoteMethod(item.name, item.static);
	});

	Folder.beforeRemote('get', function (ctx, modelinstance, next) {
		ctx.req.body.date = Date.now();
		next();
	});
};