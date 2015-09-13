module.exports = function (Folder) {
	Folder.disableRemoteMethod('create', true);
	Folder.disableRemoteMethod('find', true);
	Folder.disableRemoteMethod('upsert', true);

	Folder.beforeRemote('get', function (ctx, modelinstance, next) {
		ctx.req.body.date = Date.now();
		next();
	});
};