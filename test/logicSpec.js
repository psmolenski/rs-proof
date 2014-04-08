var Atom = require('../src/logic.js').Atom

describe('Atom', function () {
  it('should init an atom with a value', function () {
    var atom = new Atom('a');

    expect(atom.getValue()).toEqual('a');
  });

  it('should init an atom an not negated', function () {
    var atom = new Atom('a');

    expect(atom.isNegated()).toEqual(false);
  });

  it('should init an atom with a negate value', function () {
    var atom = new Atom('a', true);

    expect(atom.isNegated()).toEqual(true);
  });

  describe('negation', function () {
    it('should negate the value', function () {
      var atom = new Atom('a');

      expect(atom.isNegated()).toEqual(false);

      atom.negate();

      expect(atom.isNegated()).toEqual(true);
    });

    it('double negation should not change the negation state', function () {
      var atom1 = new Atom('a');
      var atom2 = new Atom('b', true);

      expect(atom1.isNegated()).toEqual(false);
      expect(atom2.isNegated()).toEqual(true);

      atom1.negate();
      atom1.negate();

      atom2.negate();
      atom2.negate();

      expect(atom1.isNegated()).toEqual(false);
      expect(atom2.isNegated()).toEqual(true);
    });

  });
});
