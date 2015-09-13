module.exports = function(Script) {
	Script.observe('before save', function (context, next) {
		context.instance.date = Date.now();
		next();
	});
};
