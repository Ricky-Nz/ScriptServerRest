var assert = require('chai').assert;
	request = require('superagent'),
	path = require('path');

var host = 'http://0.0.0.0:3000/api';

describe('Full api test', function () {
	this.timeout(20000);

	var user = {
		email: 'ruiqi.newzealand@gmail.com',
		password: '1234'
	};

	it('User login', function (done) {
		request
			.post(host + '/Testers/login')
			.send(user)
			.accept('json')
			.end(function (err, res) {
				assert.isNull(err, err);
				assert.property(res.body, 'id', 'access token returned');
				assert.property(res.body, 'userId', 'user id returned');
				assert.property(res.body, 'ttl', 'ttl returned');
				user.id = res.body.id;
				user.userId = res.body.userId;
				user.ttl = res.body.ttl;
				done();
			});
	});

	it('File upload', function (done) {
		request
			.post(host + '/containers/' + user.userId + '/upload')
			.query({ access_token: user.id })
			.field('title', 'apk title')
			.field('description', 'description')
			.attach('file', path.join(__dirname, 'test.apk'), 'filename2.apk')
			.accept('json')
			.end(function (err, res) {
				console.log(res.body);
				done();
			});
	});
});