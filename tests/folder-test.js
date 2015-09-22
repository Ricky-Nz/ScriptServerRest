var assert = require('chai').assert;
	request = require('superagent');

var host = 'http://0.0.0.0:3000/api';

describe('Full api test', function () {
	this.timeout(20000);

	var user = {
		email: 'ruiqi.newzealand@gmail.com',
		password: '1234'
	};
	var folder = {
		title: 'test folder name',
		newTitle: 'test folder name (new)'
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

	it('Create folder without access_token', function (done) {
		request
			.post(host + '/Folders')
			.send(folder)
			.accept('json')
			.end(function (err, res) {
				assert.equal(err.status, 401, '401 returned');
				done();
			});
	});

	it('Create folder with access_token', function (done) {
		request
			.post(host + '/Folders')
			.query({ access_token: user.id })
			.send(folder)
			.accept('json')
			.end(function (err, res) {
				assert.property(res.body, 'id', 'id returned');
				assert.equal(res.body.title, folder.title, 'name returned');
				assert.property(res.body, 'testerId', 'id returned');
				assert.property(res.body, 'date', 'date returned');
				folder.id = res.body.id;
				folder.testerId = res.body.testerId;
				folder.date = res.body.date;
				done();
			});
	});

	it('Get folder with folder id', function (done) {
		request
			.get(host + '/Folders/' + folder.id)
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.equal(res.body.id, folder.id, 'id returned');
				assert.equal(res.body.title, folder.title, 'name returned');
				assert.equal(res.body.testerId, folder.testerId, 'id returned');
				assert.equal(res.body.date, folder.date, 'id returned');
				done();
			});
	});

	it('Update folder with folder id', function (done) {
		request
			.put(host + '/Folders/' + folder.id)
			.query({ access_token: user.id })
			.send({ title: folder.newTitle })
			.accept('json')
			.end(function (err, res) {
				assert.equal(res.body.id, folder.id, 'id returned');
				assert.equal(res.body.title, folder.newTitle, 'name returned');
				assert.equal(res.body.testerId, folder.testerId, 'id returned');
				assert.notEqual(res.body.date, folder.date, 'id returned');
				done();
			});
	});

	it('Query folders', function (done) {
		request
			.get(host + '/Testers/' + user.userId + '/folders')
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.lengthOf(res.body, 1, 'folder retuends');
				done();
			});
	});

	it('Delete folder with folder id', function (done) {
		request
			.del(host + '/Folders/' + folder.id)
			.query({ access_token: user.id })
			.accept('json')
			.end(function (err, res) {
				assert.isNull(err, err);
				assert.equal(res.status, 204, 'delete folder success');
				done();
			});
	});
});