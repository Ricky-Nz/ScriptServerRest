var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.use(loopback.token({ model: app.models.accessToken }));
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

app.get('remoting').errorHandler = {
	handler: function(err, req, res, defaultHandler) {
		// switch(err.code) {
		// 	case 11000:
		// 		return res.status(400).json({
		// 			error: 'Duplicate key'
		// 		});
		// 	default:
		// 		switch(err.statusCode) {
		// 			case 401:
		// 				return res.status(401).json({
		// 					error: 'username or password is not correct'
		// 				});
		// 			case 422:
		// 				return res.status(400).json({
		// 					error: 'Email address occupied'
		// 				});
		// 		}
		// }
		// send the error back to the original handler
		defaultHandler(err);
	},
	disableStackTrace: true
};
