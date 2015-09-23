var assert = require('chai').assert;
	request = require('superagent'),
	fs = require('fs'),
	path = require('path'),
	_ = require('underscore'),
	config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'server', 'config.json')));

var host = 'http://' + config.host + ':' + config.port + config.restApiRoot;

describe('Report related api test', function () {
	this.timeout(20000);

	var user = {
		email: 'ruiqi.newzealand@gmail.com',
		password: '1234'
	};
	var report = {
		title: 'Report title',
		content: 'Report content'
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

	it('Create reprot without access_token', function (done) {
		request
			.post(host + '/Reports')
			.send(report)
			.accept('json')
			.end(function (err, res) {
				assert.equal(err.status, 401, '401 returned');
				done();
			});
	});

	it('Create report with access_token', function (done) {
		request
			.post(host + '/Reports')
			.query({ access_token: user.id })
			.send(report)
			.accept('json')
			.end(function (err, res) {
				assert.property(res.body, 'id', 'id returned');
				assert.equal(res.body.title, report.title, 'name returned');
				assert.equal(res.body.content, report.content, 'name returned');
				report.id = res.body.id;
				done();
			});
	});

	it('Get report with folder id', function (done) {
		request
			.get(host + '/Reports/' + report.id)
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.equal(res.body.id, report.id, 'id returned');
				assert.equal(res.body.title, report.title, 'name returned');
				assert.equal(res.body.content, report.content, 'id returned');
				done();
			});
	});

	it('Query reports', function (done) {
		request
			.get(host + '/Testers/' + user.userId + '/reports')
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.isArray(res.body, 'folder retuends');
				done();
			});
	});

	it('Delete report with id', function (done) {
		request
			.del(host + '/Reports/' + report.id)
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.isNull(err, err);
				assert.equal(res.status, 204, 'delete folder success');
				done();
			});
	});
});