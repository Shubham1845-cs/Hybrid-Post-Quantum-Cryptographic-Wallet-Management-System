import * as fc from 'fast-check';

describe('Property Tests - Example', () => {
  it('addition is commutative', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => a + b === b + a),
      { numRuns: 100 }
    );
  });
});
