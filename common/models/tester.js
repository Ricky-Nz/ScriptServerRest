module.exports = function(Tester) {
	Tester.reverify = function (email, cb) {
		Tester.findOne({email: email})
			.then(function (err, tester) {
				if (err) throw err;

				var options = {
					type: 'email',
					to: email,
					from: 'ruiqi.newzealand@gmail.com',
					subject: 'Thanks for registering',
					redirect: '/verified',
					user: tester
				};

				return tester.verify(options);
			})
			.then(function (err, response) {
				if (err) throw err;

				cb(null, true);
			})
			.catch(function (err) {
				cb(err);
			});
	};

	Tester.remoteMethod('reverify', {
		accepts: { arg: 'email', type: 'string' },
		returns: { arg: 'result', type: 'bool'}
	});
};
