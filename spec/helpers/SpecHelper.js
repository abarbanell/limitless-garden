beforeEach(function () {
  jasmine.addMatchers({
    toBeA: function () {
      return {
        compare: function (val, type) {
          var result = { pass: val != null && val.constructor === type || val instanceof type };

          if (result.pass) {
            result.message = 'Expected ' + val + ' to be a ' + type.name
          } else {
            result.message = 'Expected ' + val + ' to not be a ' + type.name
          }

          return result;
        }
      };
    }
  });
});
