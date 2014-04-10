describe('shunt', function () {

  var shunt = require('../lib/shunt.js');
  var Parser = shunt.Parser;
  var Scanner = shunt.Scanner;

  var ATOM = 2;
  var ALTERNATIVE = 65;
  var CONJUNCTION = 67;
  var NEGATION = 73;
  var IMPLICATION = 74;

  it("should parse an expression with single atom", function () {
    var expression = 'a';

    var parser = new Parser(new Scanner(expression));

    expect(parser.queue.length).toEqual(1);
    expect(parser.queue[0].type).toEqual(ATOM);
    expect(parser.queue[0].value).toEqual('a');

  });

  it("should parse an expression with single negated atom", function () {
    var expression = '!a';

    var parser = new Parser(new Scanner(expression));

    expect(parser.queue.length).toEqual(2);
    expect(parser.queue[0].type).toEqual(ATOM);
    expect(parser.queue[0].value).toEqual('a');
    expect(parser.queue[1].type).toEqual(NEGATION);
    expect(parser.queue[1].value).toEqual('!');

  });

  it("should parse an expression with single alternative", function () {
    var expression = 'a + b';

    var parser = new Parser(new Scanner(expression));

    expect(parser.queue.length).toEqual(3);
    expect(parser.queue[0].type).toEqual(ATOM);
    expect(parser.queue[0].value).toEqual('a');
    expect(parser.queue[1].type).toEqual(ATOM);
    expect(parser.queue[1].value).toEqual('b');
    expect(parser.queue[2].type).toEqual(ALTERNATIVE);
    expect(parser.queue[2].value).toEqual('+');

  });

  it("should parse an expression with single conjunction", function () {
    var expression = 'a * b';

    var parser = new Parser(new Scanner(expression));

    expect(parser.queue.length).toEqual(3);
    expect(parser.queue[0].type).toEqual(ATOM);
    expect(parser.queue[0].value).toEqual('a');
    expect(parser.queue[1].type).toEqual(ATOM);
    expect(parser.queue[1].value).toEqual('b');
    expect(parser.queue[2].type).toEqual(CONJUNCTION);
    expect(parser.queue[2].value).toEqual('*');

  });

  it("should parse an expression with single implication", function () {
    var expression = 'a => b';

    var parser = new Parser(new Scanner(expression));

    expect(parser.queue.length).toEqual(3);
    expect(parser.queue[0].type).toEqual(ATOM);
    expect(parser.queue[0].value).toEqual('a');
    expect(parser.queue[1].type).toEqual(ATOM);
    expect(parser.queue[1].value).toEqual('b');
    expect(parser.queue[2].type).toEqual(IMPLICATION);
    expect(parser.queue[2].value).toEqual('=>');

  });

  it("should parse an expression with implication and alternative", function () {
    var expression = 'a => b + c';

    var parser = new Parser(new Scanner(expression));

    expect(parser.queue.length).toEqual(5);
    expect(parser.queue[0].type).toEqual(ATOM);
    expect(parser.queue[0].value).toEqual('a');
    expect(parser.queue[1].type).toEqual(ATOM);
    expect(parser.queue[1].value).toEqual('b');
    expect(parser.queue[2].type).toEqual(ATOM);
    expect(parser.queue[2].value).toEqual('c');
    expect(parser.queue[3].type).toEqual(ALTERNATIVE);
    expect(parser.queue[3].value).toEqual('+');
    expect(parser.queue[4].type).toEqual(IMPLICATION);
    expect(parser.queue[4].value).toEqual('=>');

  });

  it("should parse an expression with implication and conjunction", function () {
    var expression = 'a => b * c';

    var parser = new Parser(new Scanner(expression));

    expect(parser.queue.length).toEqual(5);
    expect(parser.queue[0].type).toEqual(ATOM);
    expect(parser.queue[0].value).toEqual('a');
    expect(parser.queue[1].type).toEqual(ATOM);
    expect(parser.queue[1].value).toEqual('b');
    expect(parser.queue[2].type).toEqual(ATOM);
    expect(parser.queue[2].value).toEqual('c');
    expect(parser.queue[3].type).toEqual(CONJUNCTION);
    expect(parser.queue[3].value).toEqual('*');
    expect(parser.queue[4].type).toEqual(IMPLICATION);
    expect(parser.queue[4].value).toEqual('=>');

  });

  it("should parse an expression with (implication) and conjunction", function () {
    var expression = '(a => b) * c';

    var parser = new Parser(new Scanner(expression));

    expect(parser.queue.length).toEqual(5);
    expect(parser.queue[0].type).toEqual(ATOM);
    expect(parser.queue[0].value).toEqual('a');
    expect(parser.queue[1].type).toEqual(ATOM);
    expect(parser.queue[1].value).toEqual('b');
    expect(parser.queue[2].type).toEqual(IMPLICATION);
    expect(parser.queue[2].value).toEqual('=>');
    expect(parser.queue[3].type).toEqual(ATOM);
    expect(parser.queue[3].value).toEqual('c');
    expect(parser.queue[4].type).toEqual(CONJUNCTION);
    expect(parser.queue[4].value).toEqual('*');

  });
});