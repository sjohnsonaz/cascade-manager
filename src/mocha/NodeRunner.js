var fs = require('fs');
var path = require('path');

var Mocha = require('mocha');

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

require('isomorphic-fetch');

var DomIntegration = require('./DomIntegration');

chai.use(chaiAsPromised);

// Instantiate a Mocha instance.
var mocha = new Mocha();

var testDir = path.join(__dirname, '../../dist/tests');

// Add each .js file to the mocha instance
fs.readdirSync(testDir).filter(function (file) {
    // Only keep the .js files
    return file.substr(-3) === '.js';
}).forEach(function (file) {
    mocha.addFile(
        path.join(testDir, file)
    );
});

DomIntegration.init();

// Run the tests.
mocha.run(function (failures) {
    process.on('exit', function () {
        process.exit(failures); // exit with non-zero status if there were failures
    });
});
