var assert = require('chai').assert;
	request = require('superagent'),
	fs = require('fs'),
	path = require('path'),
	config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'server', 'config.json')));

var host = 'http://' + config.host + ':' + config.port + config.restApiRoot;

describe('User related api test', function () {
	this.timeout(20000);

	var user = {
		email: 'ruiqi.gcp@gmail.com',
		password: '1234'
	};
	var folder = {
		title: 'test folder name'
	};

	it('User sign up', function (done) {
		request
			.post(host + '/Testers')
			.send(user)
			.accept('json')
			.end(function (err, res) {
				assert.isNull(err, err);
				assert.property(res.body, 'id', 'access token returned');
				assert.equal(res.body.email, user.email, 'email returned');
				done();
			});
	});

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

	it('Get login user info without token', function (done) {
		request
			.get(host + '/Testers/' + user.userId)
			.accept('json')
			.end(function (err, res) {
				assert.equal(err.status, 401, '401 returned');
				done();
			});
	});

	it('Get login user info with token', function (done) {
		request
			.get(host + '/Testers/' + user.userId)
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.equal(res.body.id, user.userId, 'equal');
				assert.equal(res.body.email, user.email, 'equal');
				done();
			});
	});

	it('Delete user', function (done) {
		request
			.del(host + '/Testers/' + user.userId)
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.isNull(err, err);
				assert.equal(res.status, 204, 'delete user success');
				done();
			})
	});
});