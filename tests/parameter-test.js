var assert = require('chai').assert;
	request = require('superagent'),
	fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'server', 'config.json')));

var host = 'http://' + config.host + ':' + config.port + config.restApiRoot;

describe('Parameter related api test', function () {
	this.timeout(20000);

	var user = {
		email: 'ruiqi.newzealand@gmail.com',
		password: '1234'
	};
	var parameter = {
		key: 'parameter key',
		value: 'parameter value',
		newValue: 'parameter new value'
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

	it('Create parameter without access_token', function (done) {
		request
			.post(host + '/Parameters')
			.send(parameter)
			.accept('json')
			.end(function (err, res) {
				assert.equal(err.status, 401, '401 returned');
				done();
			});
	});

	it('Create parameter with access_token', function (done) {
		request
			.post(host + '/Parameters')
			.query({ access_token: user.id })
			.send(parameter)
			.accept('json')
			.end(function (err, res) {
				assert.property(res.body, 'id', 'id returned');
				assert.equal(res.body.key, parameter.key, 'name returned');
				assert.equal(res.body.value, parameter.value, 'name returned');
				parameter.id = res.body.id;
				done();
			});
	});

	it('Create parameter with save key again', function (done) {
		request
			.post(host + '/Parameters')
			.query({ access_token: user.id })
			.send(_.pick(parameter, 'key', 'value'))
			.accept('json')
			.end(function (err, res) {
				console.log(res.body);
				done();
			});
	});

	it('Get parameter with folder id', function (done) {
		request
			.get(host + '/Parameters/' + parameter.id)
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.equal(res.body.id, parameter.id, 'id returned');
				assert.equal(res.body.key, parameter.key, 'name returned');
				assert.equal(res.body.value, parameter.value, 'id returned');
				done();
			});
	});

	it('Update parameter with id', function (done) {
		request
			.put(host + '/Parameters/' + parameter.id)
			.query({ access_token: user.id })
			.send({ value: parameter.newValue })
			.accept('json')
			.end(function (err, res) {
				assert.equal(res.body.id, parameter.id, 'id returned');
				assert.equal(res.body.value, parameter.newValue, 'name returned');
				done();
			});
	});

	it('Query parameters', function (done) {
		request
			.get(host + '/Testers/' + user.userId + '/parameters')
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.isArray(res.body, 'folder retuends');
				done();
			});
	});

	it('Delete parameter with id', function (done) {
		request
			.del(host + '/Parameters/' + parameter.id)
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.isNull(err, err);
				assert.equal(res.status, 204, 'delete folder success');
				done();
			});
	});
});