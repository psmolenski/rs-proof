describe('ParsingTree', function () {

  var ParsingTree = require('../src/parsingTree.js').ParsingTree;
  var FormulaNode = require('../src/parsingTree.js').FormulaNode;
  var AtomNode = require('../src/parsingTree.js').AtomNode;
  var AlternativeNode = require('../src/parsingTree.js').AlternativeNode;
  var ConjunctionNode = require('../src/parsingTree.js').ConjunctionNode;
  var ImplicationNode = require('../src/parsingTree.js').ImplicationNode;


  describe("FormulaNode", function () {
    describe("copy", function () {
      it("should copy an empty node", function () {
        var node = new FormulaNode();
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof FormulaNode).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getValue()).toEqual(node.getValue());
      });
    });
  });

  describe("AtomNode", function () {
    describe("constructor", function () {
      it("should create an empty node", function () {
        var node = new AtomNode();

        expect(node.getValue()).toBeNull();
        expect(node.isNegated()).toBe(false);

      });

      it("should create a node with a given value", function () {
        var node = new AtomNode('a');

        expect(node.getValue()).toEqual('a');
        expect(node.isNegated()).toBe(false);

      });

      it("should create a node with a given value and negation", function () {
        var node = new AtomNode('a', true);

        expect(node.getValue()).toEqual('a');
        expect(node.isNegated()).toBe(true);

      });
    });

    describe("negation", function () {
      it("should negate a node", function () {
        var node = new AtomNode();

        expect(node.isNegated()).toBe(false);

        node.negate();

        expect(node.isNegated()).toBe(true);
      });

      it("double negation should not change the negation value", function () {
        var node = new AtomNode();

        expect(node.isNegated()).toBe(false);

        node.negate();
        node.negate();

        expect(node.isNegated()).toBe(false);

        node.negate();

        expect(node.isNegated()).toBe(true);
      });
    });

    describe("copy", function () {
      it("should copy an empty node", function () {
        var node = new AtomNode();
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof AtomNode).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getValue()).toEqual(node.getValue());
        expect(nodeCopy.isNegated()).toEqual(node.isNegated())
      });

      it("should copy a node with value", function () {
        var node = new AtomNode('a');
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof AtomNode).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getValue()).toEqual(node.getValue());
        expect(nodeCopy.isNegated()).toEqual(node.isNegated());
      });

      it("should copy a node with negation", function () {
        var node = new AtomNode('a');
        node.negate();
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof AtomNode).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getValue()).toEqual(node.getValue());
        expect(nodeCopy.isNegated()).toEqual(node.isNegated());
      });
    });
  });

  describe("ConjunctionNode", function () {
    describe("copy", function () {
      it("should copy an empty node", function () {
        var node = new ConjunctionNode();
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof ConjunctionNode).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getValue()).toEqual(node.getValue());
      });
    });
  });

  describe("AlternativeNode", function () {
    describe("copy", function () {
      it("should copy an empty node", function () {
        var node = new AlternativeNode();
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof AlternativeNode).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getValue()).toEqual(node.getValue());
      });
    });
  });

  describe("ImplicationNode", function () {
    describe("copy", function () {
      it("should copy an empty node", function () {
        var node = new ImplicationNode();
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof ImplicationNode).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getValue()).toEqual(node.getValue());
      });
    });
  });

  describe("ParsingTree", function () {
    describe("negate", function () {
      it("should negate a tree with a single atom", function () {
        var tree = new ParsingTree(new AtomNode('a'));

        expect(tree.getRoot().isNegated()).toBe(false);

        tree.negate();

        expect(tree.getRoot().isNegated()).toBe(true);
        expect(tree.getSize()).toEqual(1);

      });

      it("should negate a tree with a single alternative", function () {
        var alternative = new AlternativeNode();
        alternative.setLeftChild(new AtomNode('a'));
        alternative.setRightChild(new AtomNode('b'));
        var tree = new ParsingTree(alternative);

        expect(tree.getRoot() instanceof AlternativeNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild().isNegated()).toBe(false);

        tree.negate();

        expect(tree.getRoot() instanceof ConjunctionNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(true);
        expect(tree.getRoot().getRightChild().isNegated()).toBe(true);
        expect(tree.getSize()).toEqual(3);

      });

      it("should negate a tree with 2 alternatives", function () {
        var alternative1 = new AlternativeNode();
        var alternative2 = new AlternativeNode();
        alternative1.setLeftChild(new AtomNode('a'));
        alternative1.setRightChild(alternative2);
        alternative2.setLeftChild(new AtomNode('b'));
        alternative2.setRightChild(new AtomNode('c'));

        var tree = new ParsingTree(alternative1);

        expect(tree.getRoot() instanceof AlternativeNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild() instanceof AlternativeNode).toBe(true);
        expect(tree.getRoot().getRightChild().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild().getRightChild().isNegated()).toBe(false);

        tree.negate();

        expect(tree.getRoot() instanceof ConjunctionNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(true);
        expect(tree.getRoot().getRightChild() instanceof ConjunctionNode).toBe(true);
        expect(tree.getRoot().getRightChild().getLeftChild().isNegated()).toBe(true);
        expect(tree.getRoot().getRightChild().getRightChild().isNegated()).toBe(true);
      });

      it("should negate a tree with a single conjunction", function () {
        var conjunction = new ConjunctionNode();
        conjunction.setLeftChild(new AtomNode('a'));
        conjunction.setRightChild(new AtomNode('b'));
        var tree = new ParsingTree(conjunction);

        expect(tree.getRoot() instanceof ConjunctionNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild().isNegated()).toBe(false);

        tree.negate();

        expect(tree.getRoot() instanceof AlternativeNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(true);
        expect(tree.getRoot().getRightChild().isNegated()).toBe(true);
        expect(tree.getSize()).toEqual(3);

      });

      it("should negate a tree with 2 conjunctions", function () {
        var conjunction1 = new ConjunctionNode();
        var conjunction2 = new ConjunctionNode();
        conjunction1.setLeftChild(new AtomNode('a'));
        conjunction1.setRightChild(conjunction2);
        conjunction2.setLeftChild(new AtomNode('b'));
        conjunction2.setRightChild(new AtomNode('c'));

        var tree = new ParsingTree(conjunction1);

        expect(tree.getRoot() instanceof ConjunctionNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild() instanceof ConjunctionNode).toBe(true);
        expect(tree.getRoot().getRightChild().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild().getRightChild().isNegated()).toBe(false);

        tree.negate();

        expect(tree.getRoot() instanceof AlternativeNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(true);
        expect(tree.getRoot().getRightChild() instanceof AlternativeNode).toBe(true);
        expect(tree.getRoot().getRightChild().getLeftChild().isNegated()).toBe(true);
        expect(tree.getRoot().getRightChild().getRightChild().isNegated()).toBe(true);
      });

      it("should negate a tree with a single implication", function () {
        var implication = new ImplicationNode();
        implication.setLeftChild(new AtomNode('a'));
        implication.setRightChild(new AtomNode('b'));
        var tree = new ParsingTree(implication);

        expect(tree.getRoot() instanceof ImplicationNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild().isNegated()).toBe(false);

        tree.negate();

        expect(tree.getRoot() instanceof ConjunctionNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild().isNegated()).toBe(true);
        expect(tree.getSize()).toEqual(3);

      });

      it("should negate a tree with 2 implications", function () {
        var implication1 = new ImplicationNode();
        var implication2 = new ImplicationNode();
        implication1.setLeftChild(new AtomNode('a'));
        implication1.setRightChild(implication2);
        implication2.setLeftChild(new AtomNode('b'));
        implication2.setRightChild(new AtomNode('c'));

        var tree = new ParsingTree(implication1);

        expect(tree.getRoot() instanceof ImplicationNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild() instanceof ImplicationNode).toBe(true);
        expect(tree.getRoot().getRightChild().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild().getRightChild().isNegated()).toBe(false);

        tree.negate();

        expect(tree.getRoot() instanceof ConjunctionNode).toBe(true);
        expect(tree.getRoot().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild() instanceof ConjunctionNode).toBe(true);
        expect(tree.getRoot().getRightChild().getLeftChild().isNegated()).toBe(false);
        expect(tree.getRoot().getRightChild().getRightChild().isNegated()).toBe(true);
      });

    });

    describe('copy', function(){
      it("should copy an empty tree", function () {
        var tree = new ParsingTree();
        var treeCopy = tree.copy();

        expect(treeCopy instanceof ParsingTree).toBe(true);

        expect(treeCopy).not.toBe(tree);
      });

    });
  });

  describe("toString", function () {
    it("should stringify a tree with a single atom", function () {

      var tree = new ParsingTree(new AtomNode('a'));

      expect(tree.toString()).toEqual('a');

    });

    it("should stringify a tree with a single negated atom", function () {

      var atom = new AtomNode('a');
      atom.negate();
      var tree = new ParsingTree(atom);


      expect(tree.toString()).toEqual('!a');

    });

    it("should stringify a tree with a single alternative", function () {

      var alternative = new AlternativeNode();
      alternative.setLeftChild(new AtomNode('a'));
      alternative.setRightChild(new AtomNode('b'));
      var tree = new ParsingTree(alternative);

      expect(tree.toString()).toEqual('(a + b)');

    });

    it("should stringify a tree with 2 alternatives", function () {

      var alternative1 = new AlternativeNode();
      var alternative2 = new AlternativeNode();
      alternative1.setLeftChild(new AtomNode('a'));
      alternative1.setRightChild(alternative2);
      alternative2.setLeftChild(new AtomNode('b'));
      alternative2.setRightChild(new AtomNode('c'));

      var tree = new ParsingTree(alternative1);

      expect(tree.toString()).toEqual('(a + (b + c))');

    });

    it("should stringify a tree with a single conjunction", function () {

      var conjunction = new ConjunctionNode();
      conjunction.setLeftChild(new AtomNode('a'));
      conjunction.setRightChild(new AtomNode('b'));
      var tree = new ParsingTree(conjunction);

      expect(tree.toString()).toEqual('(a * b)');

    });

    it("should stringify a tree with 2 conjunctions", function () {

      var conjunction1 = new ConjunctionNode();
      var conjunction2 = new ConjunctionNode();
      conjunction1.setLeftChild(new AtomNode('a'));
      conjunction1.setRightChild(conjunction2);
      conjunction2.setLeftChild(new AtomNode('b'));
      conjunction2.setRightChild(new AtomNode('c'));

      var tree = new ParsingTree(conjunction1);

      expect(tree.toString()).toEqual('(a * (b * c))');

    });

    it("should stringify a tree with a single implication", function () {

      var implication = new ImplicationNode();
      implication.setLeftChild(new AtomNode('a'));
      implication.setRightChild(new AtomNode('b'));
      var tree = new ParsingTree(implication);

      expect(tree.toString()).toEqual('(a => b)');

    });

    it("should stringify a tree with a 2 implications", function () {

      var implication1 = new ImplicationNode();
      var implication2 = new ImplicationNode();
      implication1.setLeftChild(new AtomNode('a'));
      implication1.setRightChild(implication2);
      implication2.setLeftChild(new AtomNode('b'));
      implication2.setRightChild(new AtomNode('c'));

      var tree = new ParsingTree(implication1);

      expect(tree.toString()).toEqual('(a => (b => c))');

    });
  });

});