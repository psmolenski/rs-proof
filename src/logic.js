module.exports.Atom = function Atom(value, negated) {
  var _value = value, _negated = !!negated

  this.getValue = function () {
    return _value;
  };

  this.isNegated = function () {
    return _negated;
  };

  this.negate = function () {
    _negated = !_negated;
  }
};

