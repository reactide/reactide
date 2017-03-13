describe("Case-Sensitive Paths Plugin", () => {
  it('shouldn\'t interfere with correctly-spelled imports', () => {
    const getUser1 = require('../src/utils/api');
    expect(getUser1).toBeDefined();
  });

  it('should cause mistakes in filename case to fail import', () => {
    expect(() => {const getUser2 = require('../src/utils/API');}).toThrow();
  });

  it('should cause mistakes in path case to fail import', () => {
    expect(() => {const getUser3 = require('../src/Utils/api');}).toThrow();
  });

});
