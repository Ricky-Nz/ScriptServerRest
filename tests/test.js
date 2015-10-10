var fs = require('fs');
var path = require('path');
console.log(fs.readdirSync(path.join(__dirname, '..', 'client', 'releases')));