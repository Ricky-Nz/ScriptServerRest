var path = require('path')

module.exports = function(server) {
	var router = server.loopback.Router();
	router.get('/scripts', function (req, res) {
		res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'));
	});
	router.get('/parameters', function (req, res) {
		res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'));
	});
	router.get('/packages', function (req, res) {
		res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'));
	});
	router.get('/reports', function (req, res) {
		res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'));
	});
	router.get('/guide', function (req, res) {
		res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'));
	});
	router.get('/scripteditor', function (req, res) {
		res.sendFile(path.join(__dirname, '..', '..', 'client', 'index.html'));
	});
	server.use(router);
};
