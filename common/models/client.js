module.exports = function(Client) {
	Client.platform = function (callback) {
		callback(null, [
			{ name: 'Android', ready: true },
			{ name: 'iOS', ready: true },
			{ name: 'Chrome', ready: true },
			{ name: 'Firefox', ready: true },
			{ name: 'IE', ready: false }
		]);
	};

	Client.remoteMethod('platform', {
		description: 'Get supported test platform.',
		returns: { arg: 'platforms', type: 'array'}
	});
};
