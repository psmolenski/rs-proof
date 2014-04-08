describe('Parser', function () {

  var parser,
    Parser = require('../src/parser').Parser,
    Node = require('../src/tree').Node,
    AtomNode = require('../src/parsingTree').AtomNode,
    ConjunctionNode = require('../src/parsingTree').ConjunctionNode,
    AlternativeNode = require('../src/parsingTree').AlternativeNode;

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
    expect(root.getLeftChild()).toBeNull();
    expect(root.getLeftChild()).toBeNull();


  });

  it("should parse a multicharacter atomic formula", function () {
    var formula = "abcd";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(1);

    var root = parsingTree.getRoot();

    expect(root instanceof AtomNode).toBe(true);
    expect(root.getValue()).toEqual('abcd');
    expect(root.getLeftChild()).toBeNull();
    expect(root.getLeftChild()).toBeNull();

  });

  /*
     AND
      |
   a ---- b
   */


  it("should parse a simple formula with conjunction", function () {
    var formula = "a AND b";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(3);

    var root = parsingTree.getRoot();

    expect(root instanceof ConjunctionNode).toBe(true);
    expect(root.getValue()).toEqual('AND');

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
    var formula = "a AND b AND foo AND bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root.getValue()).toEqual('AND');

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(5);
    expect(leftSubTree.getRoot().getValue()).toEqual('AND');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(1);
    expect(rightSubTree.getRoot().getValue()).toEqual('bar');

    var leftSubTree2 = leftSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(3);
    expect(leftSubTree2.getRoot().getValue()).toEqual('AND');

    var rightSubTree2 = leftSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('foo');

    var leftSubTree3 = leftSubTree2.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot().getValue()).toEqual('a');

    var rightSubTree3 = leftSubTree2.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot().getValue()).toEqual('b');

  });

  /*
      OR
      |
   a ---- b
   */


  it("should parse a simple formula with alternative", function () {
    var formula = "a OR b";


    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(3);

    var root = parsingTree.getRoot();

    expect(root instanceof AlternativeNode).toBe(true);
    expect(root.getValue()).toEqual('OR');

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
    var formula = "a OR b OR foo OR bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root.getValue()).toEqual('OR');

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(5);
    expect(leftSubTree.getRoot().getValue()).toEqual('OR');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(1);
    expect(rightSubTree.getRoot().getValue()).toEqual('bar');

    var leftSubTree2 = leftSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(3);
    expect(leftSubTree2.getRoot().getValue()).toEqual('OR');

    var rightSubTree2 = leftSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('foo');

    var leftSubTree3 = leftSubTree2.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot().getValue()).toEqual('a');

    var rightSubTree3 = leftSubTree2.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot().getValue()).toEqual('b');

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

  it("should parse: a AND b OR foo OR bar", function () {
    var formula = "a AND b OR foo OR bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root.getValue()).toEqual('OR');

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(5);
    expect(leftSubTree.getRoot().getValue()).toEqual('OR');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(1);
    expect(rightSubTree.getRoot().getValue()).toEqual('bar');

    var leftSubTree2 = leftSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(3);
    expect(leftSubTree2.getRoot().getValue()).toEqual('AND');

    var rightSubTree2 = leftSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('foo');

    var leftSubTree3 = leftSubTree2.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot().getValue()).toEqual('a');

    var rightSubTree3 = leftSubTree2.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot().getValue()).toEqual('b');

  });


  /*
                  OR
                  |
             OR ------ AND
             |          |
         a ----- b foo --- bar

   */

  it("should parse: a OR b OR foo AND bar", function () {
    var formula = "a OR b OR foo AND bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root.getValue()).toEqual('OR');

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(3);
    expect(leftSubTree.getRoot().getValue()).toEqual('OR');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(3);
    expect(rightSubTree.getRoot().getValue()).toEqual('AND');

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

  it("should parse: a OR b AND foo AND bar", function () {
    var formula = "a OR b AND foo AND bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root.getValue()).toEqual('OR');

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(1);
    expect(leftSubTree.getRoot().getValue()).toEqual('a');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(5);
    expect(rightSubTree.getRoot().getValue()).toEqual('AND');

    var leftSubTree2 = rightSubTree.getRoot().getLeftSubtree();
    expect(leftSubTree2.getSize()).toEqual(3);
    expect(leftSubTree2.getRoot().getValue()).toEqual('AND');

    var rightSubTree2 = rightSubTree.getRoot().getRightSubtree();
    expect(rightSubTree2.getSize()).toEqual(1);
    expect(rightSubTree2.getRoot().getValue()).toEqual('bar');

    var leftSubTree3 = leftSubTree2.getRoot().getLeftSubtree();
    expect(leftSubTree3.getSize()).toEqual(1);
    expect(leftSubTree3.getRoot().getValue()).toEqual('b');

    var rightSubTree3 = leftSubTree2.getRoot().getRightSubtree();
    expect(rightSubTree3.getSize()).toEqual(1);
    expect(rightSubTree3.getRoot().getValue()).toEqual('foo');

  });

  /*
             OR
             |
       AND ------ AND
       |           |
    a --- b   foo ---- bar

   */

  it("should parse: a AND b OR foo AND bar", function () {
    var formula = "a AND b OR foo AND bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root.getValue()).toEqual('OR');

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(3);
    expect(leftSubTree.getRoot().getValue()).toEqual('AND');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(3);
    expect(rightSubTree.getRoot().getValue()).toEqual('AND');

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

  });

  /*
           =>
           |
       AND ------ OR
       |           |
   a --- b   foo ---- bar

   */

  it("should parse: a AND b => foo OR bar", function () {
    var formula = "a AND b => foo OR bar";

    var parsingTree = parser.parse(formula);

    expect(parsingTree.getSize()).toEqual(7);

    var root = parsingTree.getRoot();

    expect(root.getValue()).toEqual('=>');

    var leftSubTree = root.getLeftSubtree();
    expect(leftSubTree.getSize()).toEqual(3);
    expect(leftSubTree.getRoot().getValue()).toEqual('AND');

    var rightSubTree = root.getRightSubtree();
    expect(rightSubTree.getSize()).toEqual(3);
    expect(rightSubTree.getRoot().getValue()).toEqual('OR');

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

  });

});