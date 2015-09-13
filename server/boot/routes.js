module.exports = function(server) {
	var Tester = server.models.Tester;
	var RoleMapping = server.models.RoleMapping;
	var Role = server.models.Role;

	// Tester.create(
	// 	{ email: 'ruiqi.sg@gmail.com', password: '1234' }
	// ).then(function (err, user) {
	// 	if (err) throw err;

	// 	return Role.create({name: 'admin'});
	// }).then(function (err, role) {
	// 	if (err) throw err;

	// 	return role.principals.create({
	// 		principalType: RoleMapping.USER,
	// 		principalId: user.id
	// 	});
	// }).then(function (err, principal) {
	// 	if (err) throw err;
	// }).catch(function (err) {
	// 	console.log("Setup Admin Failed:");
	// 	console.log(err);
	// });
};
