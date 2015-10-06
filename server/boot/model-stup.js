var async = require('async');

module.exports = function (server) {
	var mongoDs = server.dataSources.mongoDS;

	mongoDs.autoupdate(function (err) {
		if (err) {
    		console.error('Database could not be autoupdated', err);
  		}
  		console.log('Database autoupdated');
	});

	// mongoDs.createModel('Folder', {
	// 	title: { type: String, required: true }
	// });

	// mongoDs.createModel('Script', {
	// 	title: { type: String, required: true },
	// 	date: { type: Date, required: true }
	// });

	// mongoDs.createModel('Action', {
	// 	type: { type: String, required: true },
	// 	target: { type: String },
	// 	params: { type: String }
	// })
}