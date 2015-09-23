var restApiFilter = require('../restApiFilter');

module.exports = function (Package) {
	restApiFilter(Package, ['findById', 'deleteById']);

	Package.beforeRemote('deleteById', function (context, data, next) {
		Package.findById(context.req.params.id, function (err, package) {
			if (err) return next(err);

			Package.app.models.Container.removeFile(package.testerId.toString(), package.fileName, function (err, result) {
				next();
			});
		});
	});
};
