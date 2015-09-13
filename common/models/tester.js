module.exports = function(Tester) {
	Tester.disableRemoteMethod('upsert', true);
	Tester.disableRemoteMethod('find', true);
	Tester.disableRemoteMethod('exists', true);
	Tester.disableRemoteMethod('findById', true);
	Tester.disableRemoteMethod('deleteById', true);
	Tester.disableRemoteMethod('createChangeStream', true);
	Tester.disableRemoteMethod('count', true);
	Tester.disableRemoteMethod('findOne', true);
	Tester.disableRemoteMethod('updateAll', true);

	Tester.disableRemoteMethod('updateAttributes', false);
	Tester.disableRemoteMethod('__create__accessTokens', false);
	Tester.disableRemoteMethod('__get__accessTokens', false);
	Tester.disableRemoteMethod('__delete__accessTokens', false);
	Tester.disableRemoteMethod('__findById__accessTokens', false);
	Tester.disableRemoteMethod('__destroyById__accessTokens', false);
	Tester.disableRemoteMethod('__updateById__accessTokens', false);
	Tester.disableRemoteMethod('__count__accessTokens', false);

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
		description: 'Rend send verification email.',
		accepts: { arg: 'email', type: 'string' },
		returns: { arg: 'result', type: 'bool'}
	});
};
