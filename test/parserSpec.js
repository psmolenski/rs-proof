describe('Parser', function () {

  var parser,
    Parser = require('../src/parser/parser').Parser,
    AtomNode = require('../src/parsingTree').AtomNode,
    ConjunctionNode = require('../src/parsingTree').ConjunctionNode,
    AlternativeNode = require('../src/parsingTree').AlternativeNode,
    ImplicationNode = require('../src/parsingTree').ImplicationNode,
    FormulaNode = require('../src/parsingTree').FormulaNode;

  beforeEach(function () {
    parser = new Parser();
  });

  it("should parse an atomic formula", function () {
    var formula = "a";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(1);

    var root = parsingTree.getRoot();

    expect(root instanceof AtomNode).toBe(true);
    expect(root.getValue()).toEqual('a');
    expect(root.isNegated()).toBe(false);
    expect(root.getLeftChild()).toBeNull();
    expect(root.getLeftChild()).toBeNull();

    expect(parsingTree.toString()).toEqual('a');


  });

  it("should parse a multicharacter atomic formula", function () {
    var formula = "abcd";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(1);

    var root = parsingTree.getRoot();

    expect(root instanceof AtomNode).toBe(true);
    expect(root.isNegated()).toBe(false);
    expect(root.getValue()).toEqual('abcd');
    expect(root.getLeftChild()).toBeNull();
    expect(root.getLeftChild()).toBeNull();

    expect(parsingTree.toString()).toEqual('abcd');

  });

  it("should parse an atomic formula with single negation", function () {
    var formula = "!a";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(1);

    var root = parsingTree.getRoot();

    expect(root instanceof AtomNode).toBe(true);
    expect(root.getValue()).toEqual('a');
    expect(root.isNegated()).toBe(true);
    expect(root.getLeftChild()).toBeNull();
    expect(root.getLeftChild()).toBeNull();

    expect(parsingTree.toString()).toEqual('!a');


  });

  it("should parse an atomic formula with double negation", function () {
    var formula = "!!a";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(1);

    var root = parsingTree.getRoot();

    expect(root instanceof AtomNode).toBe(true);
    expect(root.getValue()).toEqual('a');
    expect(root.isNegated()).toBe(false);
    expect(root.getLeftChild()).toBeNull();
    expect(root.getLeftChild()).toBeNull();

    expect(parsingTree.toString()).toEqual('a');

  });

  it("should parse an atomic formula with triple negation", function () {
    var formula = "!!!a";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(1);

    var root = parsingTree.getRoot();

    expect(root instanceof AtomNode).toBe(true);
    expect(root.getValue()).toEqual('a');
    expect(root.isNegated()).toBe(true);
    expect(root.getLeftChild()).toBeNull();
    expect(root.getLeftChild()).toBeNull();

    expect(parsingTree.toString()).toEqual('!a');

  });

  /*
     AND
      |
   a ---- b
   */


  it("should parse a simple formula with conjunction", function () {
    var formula = "a * b";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(3);

    var root = parsingTree.getRoot();

    expect(root instanceof ConjunctionNode).toBe(true);

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree).not.toBeNull();
    expect(leftSubTree.getSize()).toEqual(1);
    expect(leftSubTree.getRoot() instanceof AtomNode).toBe(true);
    expect(leftSubTree.getRoot().getValue()).toEqual('a');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree).not.toBeNull();
    expect(rightSubTree.getSize()).toEqual(1);
    expect(rightSubTree.getRoot() instanceof AtomNode).toBe(true);
    expect(rightSubTree.getRoot().getValue()).toEqual('b');

    expect(parsingTree.toString()).toEqual('(a * b)');

  });

  it("should parse a * !b", function () {
    var formula = "a * !b";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(3);

    var root = parsingTree.getRoot();

    expect(root instanceof ConjunctionNode).toBe(true);

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree).not.toBeNull();
    expect(leftSubTree.getSize()).toEqual(1);
    expect(leftSubTree.getRoot() instanceof AtomNode).toBe(true);
    expect(leftSubTree.getRoot().getValue()).toEqual('a');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree).not.toBeNull();
    expect(rightSubTree.getSize()).toEqual(1);
    expect(rightSubTree.getRoot() instanceof AtomNode).toBe(true);
    expect(rightSubTree.getRoot().getValue()).toEqual('b');
    expect(rightSubTree.getRoot().isNegated()).toBe(true);

    expect(parsingTree.toString()).toEqual('(a * !b)');

  });

  /*
            AND
             |
        AND ------ bar
         |
   AND ----- foo
     |
 a ----- b
   */

  it("should parse a formula with conjunction", function () {
    var formula = "a * b * foo * bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root instanceof ConjunctionNode).toBe(true);

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(5);
    expect(leftSubTree.getRoot() instanceof ConjunctionNode).toBe(true);

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(1);
    expect(rightSubTree.getRoot().getValue()).toEqual('bar');

    var leftSubTree2 = leftSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(3);
    expect(leftSubTree2.getRoot() instanceof ConjunctionNode).toBe(true);

    var rightSubTree2 = leftSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('foo');

    var leftSubTree3 = leftSubTree2.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot().getValue()).toEqual('a');

    var rightSubTree3 = leftSubTree2.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot().getValue()).toEqual('b');

    expect(parsingTree.toString()).toEqual('(((a * b) * foo) * bar)');

  });

  /*
      OR
      |
   a ---- b
   */


  it("should parse a simple formula with alternative", function () {
    var formula = "a + b";


    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(3);

    var root = parsingTree.getRoot();

    expect(root instanceof AlternativeNode).toBe(true);

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree).not.toBeNull();
    expect(leftSubTree.getSize()).toEqual(1);
    expect(leftSubTree.getRoot() instanceof AtomNode).toBe(true);
    expect(leftSubTree.getRoot().getValue()).toEqual('a');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree).not.toBeNull();
    expect(rightSubTree.getSize()).toEqual(1);
    expect(rightSubTree.getRoot() instanceof AtomNode).toBe(true);
    expect(rightSubTree.getRoot().getValue()).toEqual('b');

    expect(parsingTree.toString()).toEqual('(a + b)');


  });


  /*
                   OR
                   |
             OR ------ bar
              |
       OR ----- foo
       |
   a ----- b
   */

  it("should parse: a OR b OR foo OR bar", function () {
    var formula = "a + b + foo + bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root instanceof AlternativeNode).toBe(true);

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(5);
    expect(leftSubTree.getRoot() instanceof AlternativeNode).toBe(true);

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(1);
    expect(rightSubTree.getRoot().getValue()).toEqual('bar');

    var leftSubTree2 = leftSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(3);
    expect(leftSubTree2.getRoot() instanceof AlternativeNode).toBe(true);

    var rightSubTree2 = leftSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('foo');

    var leftSubTree3 = leftSubTree2.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot().getValue()).toEqual('a');

    var rightSubTree3 = leftSubTree2.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot().getValue()).toEqual('b');

    expect(parsingTree.toString()).toEqual('(((a + b) + foo) + bar)');

  });


  /*
                 OR
                 |
           OR ------ bar
           |
      AND --- foo
       |
    a --- b

   */

  it("should parse: a * b + foo + bar", function () {
    var formula = "a * b + foo + bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root instanceof AlternativeNode).toBe(true);

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(5);
    expect(leftSubTree.getRoot() instanceof AlternativeNode).toBe(true);

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(1);
    expect(rightSubTree.getRoot().getValue()).toEqual('bar');

    var leftSubTree2 = leftSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(3);
    expect(leftSubTree2.getRoot() instanceof ConjunctionNode).toBe(true);

    var rightSubTree2 = leftSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('foo');

    var leftSubTree3 = leftSubTree2.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot().getValue()).toEqual('a');

    var rightSubTree3 = leftSubTree2.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot().getValue()).toEqual('b');

    expect(parsingTree.toString()).toEqual('(((a * b) + foo) + bar)');

  });


  /*
                  OR
                  |
             OR ------ AND
             |          |
         a ----- b foo --- bar

   */

  it("should parse: a + b + foo * bar", function () {
    var formula = "a + b + foo * bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root instanceof AlternativeNode).toBe(true);

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(3);
    expect(leftSubTree.getRoot() instanceof AlternativeNode).toBe(true);


    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(3);
    expect(rightSubTree.getRoot() instanceof ConjunctionNode).toBe(true);


    var leftSubTree2 = leftSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(1);
    expect(leftSubTree2.getRoot().getValue()).toEqual('a');

    var rightSubTree2 = leftSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('b');

    var leftSubTree3 = rightSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot() instanceof FormulaNode).toBe(true);
    expect(leftSubTree3.getRoot().getValue()).toEqual('foo');

    var rightSubTree3 = rightSubTree.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot() instanceof AtomNode).toBe(true);
    expect(rightSubTree3.getRoot().getValue()).toEqual('bar');

    expect(parsingTree.toString()).toEqual('((a + b) + (foo * bar))');

  });

  /*
         OR
         |
     a ------ AND
               |
         AND ----- bar
           |
      b --- foo

   */

  it("should parse: a + b * foo * bar", function () {
    var formula = "a + b * foo * bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root instanceof AlternativeNode).toBe(true);

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(1);
    expect(leftSubTree.getRoot().getValue()).toEqual('a');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(5);
    expect(rightSubTree.getRoot() instanceof ConjunctionNode).toBe(true);

    var leftSubTree2 = rightSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(3);
    expect(leftSubTree2.getRoot() instanceof ConjunctionNode).toBe(true);

    var rightSubTree2 = rightSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('bar');

    var leftSubTree3 = leftSubTree2.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot().getValue()).toEqual('b');

    var rightSubTree3 = leftSubTree2.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot().getValue()).toEqual('foo');

    expect(parsingTree.toString()).toEqual('(a + ((b * foo) * bar))');

  });

  /*
             OR
             |
       AND ------ AND
       |           |
    a --- b   foo ---- bar

   */

  it("should parse: a * b + foo * bar", function () {
    var formula = "a * b + foo * bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root instanceof AlternativeNode).toBe(true);

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(3);
    expect(leftSubTree.getRoot() instanceof ConjunctionNode).toBe(true);

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(3);
    expect(rightSubTree.getRoot() instanceof ConjunctionNode).toBe(true);

    var leftSubTree2 = leftSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(1);
    expect(leftSubTree2.getRoot().getValue()).toEqual('a');

    var rightSubTree2 = leftSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('b');

    var leftSubTree3 = rightSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot().getValue()).toEqual('foo');

    var rightSubTree3 = rightSubTree.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot().getValue()).toEqual('bar');

    expect(parsingTree.toString()).toEqual('((a * b) + (foo * bar))');

  });

  /*
           =>
           |
       AND ------ OR
       |           |
   a --- b   foo ---- bar

   */

  it("should parse: a * b => foo + bar", function () {
    var formula = "a * b => foo + bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root instanceof ImplicationNode).toBe(true);

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(3);
    expect(leftSubTree.getRoot() instanceof ConjunctionNode).toBe(true);


    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(3);
    expect(rightSubTree.getRoot() instanceof AlternativeNode).toBe(true);

    var leftSubTree2 = leftSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(1);
    expect(leftSubTree2.getRoot().getValue()).toEqual('a');

    var rightSubTree2 = leftSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('b');

    var leftSubTree3 = rightSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot().getValue()).toEqual('foo');

    var rightSubTree3 = rightSubTree.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot().getValue()).toEqual('bar');

    expect(parsingTree.toString()).toEqual('((a * b) => (foo + bar))');

  });

});