// test configuration for the node server side tests

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/jasmine.json');

var JasmineConsoleReporter = require('jasmine-console-reporter');
var reporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2 
    cleanStack: 1,       // (0|false)|(1|true)|2|3 
    verbosity: 4,        // (0|false)|1|2|(3|true)|4 
    listStyle: 'indent', // "flat"|"indent" 
    activity: false
});

process.env.PORT = process.env.TEST_PORT;

jasmine.addReporter(reporter);

jasmine.execute();




