// test configuration for the node server side tests
var Jasmine = require('jasmine');
var jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/jasmine.json');
var JasmineConsoleReporter = require('jasmine-console-reporter');
var reporter = new JasmineConsoleReporter({
    colors: 1,
    cleanStack: 1,
    verbosity: 4,
    listStyle: 'indent',
    activity: false
});
process.env.PORT = process.env.TEST_PORT;
jasmine.addReporter(reporter);
jasmine.execute();
//# sourceMappingURL=jasmine.js.map