var debug = require('debug'),
	log = debug('app:log'),
	error = debug('app:error'),
	restApiFilter = require('../restApiFilter');

module.exports = function(Tester) {
	restApiFilter(Tester, ['create', 'findById', 'deleteById', '__get__folders', '__get__packages', '__get__parameters', '__get__reports', 'login', 'logout']);

	// Tester.afterRemote('create', function (context, tester, next) {
	// 	var options = {
	// 		type: 'email',
	// 		to: tester.email,
	// 		from: 'ruiqi.newzealand@gmail.com',
	// 		subject: 'Thanks for registering',
	// 		redirect: '/',
	// 		user: tester
	// 	};

	// 	tester.verify(options)
	// 		.then(function (err, response) {
	// 			if (err) throw err;

	// 			log('send verification email sucess');
	// 			next();
	// 		})
	// 		.catch(function (err) {
	// 			error(err);
	// 			next(err);
	// 		});
	// });

	Tester.reverify = function (email, cb) {
		Tester.findOne({email: email})
			.then(function (err, tester) {
				if (err) throw err;

				var options = {
					type: 'email',
					to: email,
					from: 'ruiqi.newzealand@gmail.com',
					subject: 'Thanks for registering',
					redirect: '/',
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
		description: 'Rend send verification email.',
		accepts: { arg: 'email', type: 'string' },
		returns: { arg: 'result', type: 'bool'}
	});
};
