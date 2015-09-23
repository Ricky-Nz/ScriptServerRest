var fs = require('fs');
var path = require('path');
console.log(JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'server', 'config.json'))));