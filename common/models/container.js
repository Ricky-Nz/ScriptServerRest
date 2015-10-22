var restApiFilter = require('../restApiFilter');
var path = require('path');
var targz = require('tar.gz');
var fs = require('fs-extra');

module.exports = function(Container) {
	Container.disableRemoteMethod('getContainers', true);
	Container.disableRemoteMethod('createContainer', true);
	Container.disableRemoteMethod('destroyContainer', true);
	Container.disableRemoteMethod('getContainer', true);
	Container.disableRemoteMethod('getFiles', true);
	Container.disableRemoteMethod('getFile', true);
	Container.disableRemoteMethod('removeFile', true);

	Container.beforeRemote('download', function (context, data, next) {
		if (context.req.params.container != context.req.accessToken.userId) {
			context.res.status(401).end();
		}
		
		return next();
	});

	Container.beforeRemote('upload', function (context, data, next) {
		if (context.req.params.container != context.req.accessToken.userId) {
			context.res.status(401).end();
			return next();
		}

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
		var file;
		if (data.result.files && data.result.files.file) {
			file = data.result.files.file[0];
		}
		if (!file) {
			context.res.status(401);
			return next();
		}

		if (file.name.indexOf('.tar.gz') > 0) {
			if (!data.result.fields.report) {
				return next(new Error('report data not found'));
			}

			var report = JSON.parse(data.result.fields.report);
			report.testerId = file.container;
			report.date = new Date();

			Container.app.models.Report.create(report, function (err, report) {
				var zipFilePath = path.join(__dirname, '..', '..', 'client', 'storage', report.testerId.toString(), file.name);
				if (err) {
					fs.remove(zipFilePath);
					return next(err);
				}
				
				var extractPath = path.join(__dirname, '..', '..', 'client', 'storage', report.testerId.toString(), 'reports', report.id.toString());
				new targz().extract(zipFilePath, extractPath, function(err){
				  	fs.remove(zipFilePath);

				    if (err) {
				        return next(err);
				    }

					context.result = report;
					next();
				});
			});
		} else {
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
		}
	});
};
