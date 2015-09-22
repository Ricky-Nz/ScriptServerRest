var restApiFilter = require('../restApiFilter');

module.exports = function(Container) {
	Container.disableRemoteMethod('getContainers', true);
	Container.disableRemoteMethod('createContainer', true);
	Container.disableRemoteMethod('destroyContainer', true);
	Container.disableRemoteMethod('getContainer', true);
	Container.disableRemoteMethod('getFiles', true);
	Container.disableRemoteMethod('getFile', true);
	Container.disableRemoteMethod('removeFile', true);

	Container.beforeRemote('upload', function (context, data, next) {
		if (!context.req.accessToken || context.req.params.container != context.req.accessToken.userId) {
			context.res.status(401).end();
			return next();
		}

		console.log(context.req);

		Container.getContainer(context.req.params.container, function (err, container) {
			if (container) {
				return next()
			} else {
				Container.createContainer({ name: context.req.params.container }, function (err, container) {
					if (err) return next(err);

					next();
				});
			}
		});
	});

	Container.afterRemote('upload', function (context, data, next) {
		var file = data.result.files.file[0];
		if (!file) {
			context.res.status(401);
			return next();
		}

		var title = data.result.fields.title[0];
		var description = data.result.fields.description[0];

		Container.app.models.Package.create({
			title: title ? title : file.name,
			description: description,
			fileName: file.name,
			size: file.size,
			type: file.type,
			testerId: file.container,
			date: new Date()
		}, function (err, package) {
			if (err) return next(err);

			context.result = package;
			next();
		});
	});
};
