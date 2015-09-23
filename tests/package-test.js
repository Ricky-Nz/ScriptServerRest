var assert = require('chai').assert;
	request = require('superagent'),
	_ = require('underscore'),
	fs = require('fs'),
	path = require('path'),
	config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'server', 'config.json')));

var host = 'http://' + config.host + ':' + config.port + config.restApiRoot;

describe('Package related api test', function () {
	this.timeout(20000);

	var user = {
		email: 'ruiqi.newzealand@gmail.com',
		password: '1234'
	};
	var newPackage = {
		title: 'new title',
		description: 'new description'
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
				user = _.extend(user, res.body);
				done();
			});
	});

	it('Create package', function (done) {
		request
			.post(host + '/Containers/' + user.userId + '/upload')
			.query({ access_token: user.id })
			.field('title', newPackage.title)
			.field('description', newPackage.description)
			.attach('file', path.join(__dirname, 'test.apk'), Date.now() + '_test.apk')
			.accept('json')
			.end(function (err, res) {
				assert.property(res.body, 'id', 'id token returned');
				assert.property(res.body, 'title', 'title token returned');
				assert.property(res.body, 'type', 'type token returned');
				assert.property(res.body, 'fileName', 'fileName token returned');
				assert.property(res.body, 'description', 'description token returned');
				assert.property(res.body, 'date', 'date token returned');
				assert.property(res.body, 'size', 'size token returned');
				assert.property(res.body, 'testerId', 'testerId token returned');
				newPackage = _.extend(newPackage, res.body); 
				done();
			});
	});

	it('Get package info without access_token', function (done) {
		request
			.get(host + '/Packages/' + newPackage.id)
			.accept('json')
			.end(function (err, res) {
				assert.equal(err.status, 401, 'access token required');
				done();
			});
	});

	it('Get package info with access_token', function (done) {
		request
			.get(host + '/Packages/' + newPackage.id)
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.equal(res.body.id, newPackage.id, 'info returned');
				done();
			});
	});

	it('Query packages', function (done) {
		request
			.get(host + '/Testers/' + user.userId + '/packages')
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.isArray(res.body, 'package retuends');
				done();
			});
	});

	it('Delete package', function (done) {
		request
			.del(host + '/Packages/' + newPackage.id)
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.equal(res.status, 204, 'delete success');
				done();
			});
	});
});




