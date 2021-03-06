describe('RsTree', function () {

  var rsTree = require('../src/rsTree');
  var parsingTree = require('../src/parsingTree');
  var ParsingTree = parsingTree.ParsingTree;
  var AtomNode = parsingTree.AtomNode;
  var AlternativeNode = parsingTree.AlternativeNode;
  var ConjunctionNode = parsingTree.ConjunctionNode;
  var ImplicationNode = parsingTree.ImplicationNode;
  var Tree = require('../src/tree').Tree;
  var Node = require('../src/tree').Node;
  var RsNode = rsTree.RsNode;
  var RsTree = rsTree.RsTree;
  var createFromParsingTree = rsTree.createFromParsingTree;

  describe("RsNode", function () {

    describe("constructor", function () {

      it("should set a value to an empty array in no initial value has been supplied", function () {
        var node = new RsNode();

        expect(node.getValue()).toEqual([]);

      });

      it("should set a value to an empty array initial value is undefined", function () {
        var node = new RsNode(undefined);

        expect(node.getValue()).toEqual([]);

      });

      it("should accept array as an initial value", function () {
        var node = new RsNode(['a', 'b']);

        expect(node.getValue()).toEqual(['a', 'b']);

      });

      it("should not accept string as an initial value", function () {


        expect(function () {
          var node = new RsNode('foo');
        }).toThrow();

      });

      it("should not accept int as an initial value", function () {


        expect(function () {
          var node = new RsNode(123);
        }).toThrow();

      });

      it("should not accept float as an initial value", function () {


        expect(function () {
          var node = new RsNode(12.3);
        }).toThrow();

      });

      it("should not accept object as an initial value", function () {


        expect(function () {
          var node = new RsNode({});
        }).toThrow();

      });

      it("should not accept booleav as an initial value", function () {


        expect(function () {
          var node = new RsNode(true);
        }).toThrow();

        expect(function () {
          var node = new RsNode(false);
        }).toThrow();

      });

      it("should not accept function as an initial value", function () {


        expect(function () {
          var node = new RsNode(function () {
          });
        }).toThrow();

      });

      it("should not accept regex as an initial value", function () {


        expect(function () {
          var node = new RsNode(/abc/);
        }).toThrow();

      });

      it("should not accept null as an initial value", function () {


        expect(function () {
          var node = new RsNode(null);
        }).toThrow();

      });

      it("should not accept NaN as an initial value", function () {


        expect(function () {
          var node = new RsNode(NaN);
        }).toThrow();

      });


    });

    describe("isDecomposable", function () {

      it("should return false if node contains only Atoms", function () {
        var node = new RsNode();

        node.setValue([new ParsingTree(new AtomNode('a')), new ParsingTree(new AtomNode('b'))]);

        expect(node.isDecomposable()).toBe(false);

      });

    });

    describe("decompose", function () {
      it("should decompose a node with a single parsing tree (alternative)", function () {
        var root = new AlternativeNode();
        root.setLeftChild(new AtomNode('a'));
        root.setRightChild(new AtomNode('b'));
        var tree = new ParsingTree(root);

        var rsNode = new RsNode([tree]);

        var decompositionResult = rsNode.decompose();

        expect(decompositionResult.length).toEqual(1);
        expect(decompositionResult[0] instanceof RsNode).toBe(true);

        var rsNode = decompositionResult[0];
        var rsNodeValue = rsNode.getValue();

        expect(rsNodeValue.length).toEqual(2);
        expect(rsNodeValue[0] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[0].getRoot().getValue()).toEqual('a');
        expect(rsNodeValue[1] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[1].getRoot().getValue()).toEqual('b');

      });

      it("should decompose a node with [Atom, Alternative]", function () {
        var atom = new AtomNode('x');
        var alternative = new AlternativeNode();
        alternative.setLeftChild(new AtomNode('a'));
        alternative.setRightChild(new AtomNode('b'));

        var rsNode = new RsNode([new ParsingTree(atom), new ParsingTree(alternative)]);

        var decompositionResult = rsNode.decompose();

        expect(decompositionResult.length).toEqual(1);
        expect(decompositionResult[0] instanceof RsNode).toBe(true);

        var rsNode = decompositionResult[0];
        var rsNodeValue = rsNode.getValue();

        expect(rsNodeValue.length).toEqual(3);
        expect(rsNodeValue[0] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[0].getRoot().getValue()).toEqual('x');
        expect(rsNodeValue[1] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[1].getRoot().getValue()).toEqual('a');
        expect(rsNodeValue[2] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[2].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[2].getRoot().getValue()).toEqual('b');

      });

      it("should decompose a node with [Atom, Alternative, Atom]", function () {
        var atom1 = new AtomNode('x');
        var atom2 = new AtomNode('y');
        var alternative = new AlternativeNode();
        alternative.setLeftChild(new AtomNode('a'));
        alternative.setRightChild(new AtomNode('b'));

        var rsNode = new RsNode([new ParsingTree(atom1), new ParsingTree(alternative), new ParsingTree(atom2)]);

        var decompositionResult = rsNode.decompose();

        expect(decompositionResult.length).toEqual(1);
        expect(decompositionResult[0] instanceof RsNode).toBe(true);

        var rsNode = decompositionResult[0];
        var rsNodeValue = rsNode.getValue();

        expect(rsNodeValue.length).toEqual(4);
        expect(rsNodeValue[0] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[0].getRoot().getValue()).toEqual('x');
        expect(rsNodeValue[1] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[1].getRoot().getValue()).toEqual('a');
        expect(rsNodeValue[2] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[2].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[2].getRoot().getValue()).toEqual('b');
        expect(rsNodeValue[3] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[3].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[3].getRoot().getValue()).toEqual('y');

      });

      it("should decompose a node with [Alternative, Atom, Atom]", function () {
        var atom1 = new AtomNode('x');
        var atom2 = new AtomNode('y');
        var alternative = new AlternativeNode();
        alternative.setLeftChild(new AtomNode('a'));
        alternative.setRightChild(new AtomNode('b'));

        var rsNode = new RsNode([new ParsingTree(alternative), new ParsingTree(atom1), new ParsingTree(atom2)]);

        var decompositionResult = rsNode.decompose();

        expect(decompositionResult.length).toEqual(1);
        expect(decompositionResult[0] instanceof RsNode).toBe(true);

        var rsNode = decompositionResult[0];
        var rsNodeValue = rsNode.getValue();

        expect(rsNodeValue.length).toEqual(4);
        expect(rsNodeValue[0] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[0].getRoot().getValue()).toEqual('a');
        expect(rsNodeValue[1] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[1].getRoot().getValue()).toEqual('b');
        expect(rsNodeValue[2] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[2].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[2].getRoot().getValue()).toEqual('x');
        expect(rsNodeValue[3] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[3].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[3].getRoot().getValue()).toEqual('y');

      });

      it("should decompose a node with [Atom, Atom, Alternative]", function () {
        var atom1 = new AtomNode('x');
        var atom2 = new AtomNode('y');
        var alternative = new AlternativeNode();
        alternative.setLeftChild(new AtomNode('a'));
        alternative.setRightChild(new AtomNode('b'));

        var rsNode = new RsNode([new ParsingTree(atom1), new ParsingTree(atom2), new ParsingTree(alternative)]);

        var decompositionResult = rsNode.decompose();

        expect(decompositionResult.length).toEqual(1);
        expect(decompositionResult[0] instanceof RsNode).toBe(true);

        var rsNode = decompositionResult[0];
        var rsNodeValue = rsNode.getValue();

        expect(rsNodeValue.length).toEqual(4);
        expect(rsNodeValue[0] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[0].getRoot().getValue()).toEqual('x');
        expect(rsNodeValue[1] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[1].getRoot().getValue()).toEqual('y');
        expect(rsNodeValue[2] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[2].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[2].getRoot().getValue()).toEqual('a');
        expect(rsNodeValue[3] instanceof ParsingTree).toBe(true);
        expect(rsNodeValue[3].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNodeValue[3].getRoot().getValue()).toEqual('b');

      });

      it("should decompose a node with [Conjunction]", function () {
        var root = new ConjunctionNode();
        root.setLeftChild(new AtomNode('a'));
        root.setRightChild(new AtomNode('b'));
        var tree = new ParsingTree(root);

        var rsNode = new RsNode([tree]);

        var decompositionResult = rsNode.decompose();

        expect(decompositionResult.length).toEqual(2);

        expect(decompositionResult[0] instanceof RsNode).toBe(true);

        var rsNode1 = decompositionResult[0];
        var rsNode1Value = rsNode1.getValue();

        expect(rsNode1Value[0] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[0].getRoot().getValue()).toEqual('a');

        expect(decompositionResult[1] instanceof RsNode).toBe(true);

        var rsNode2 = decompositionResult[1];
        var rsNode2Value = rsNode2.getValue();

        expect(rsNode2Value[0] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[0].getRoot().getValue()).toEqual('b');

      });

      it("should decompose a node with [Atom, Conjunction]", function () {
        var atom = new AtomNode('x');
        var root = new ConjunctionNode();
        root.setLeftChild(new AtomNode('a'));
        root.setRightChild(new AtomNode('b'));
        var tree = new ParsingTree(root);

        var rsNode = new RsNode([new ParsingTree(atom), tree]);

        var decompositionResult = rsNode.decompose();

        expect(decompositionResult.length).toEqual(2);

        expect(decompositionResult[0] instanceof RsNode).toBe(true);

        var rsNode1 = decompositionResult[0];
        var rsNode1Value = rsNode1.getValue();

        expect(rsNode1Value.length).toEqual(2)
        expect(rsNode1Value[0] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[0].getRoot().getValue()).toEqual('x');
        expect(rsNode1Value[1] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[1].getRoot().getValue()).toEqual('a');

        expect(decompositionResult[1] instanceof RsNode).toBe(true);

        var rsNode2 = decompositionResult[1];
        var rsNode2Value = rsNode2.getValue();

        expect(rsNode2Value.length).toEqual(2)
        expect(rsNode2Value[0] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[0].getRoot().getValue()).toEqual('x');
        expect(rsNode2Value[1] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[1].getRoot().getValue()).toEqual('b');
      });

      it("should decompose a node with [Atom, Conjunction, Atom]", function () {
        var atom1 = new AtomNode('x');
        var atom2 = new AtomNode('y');
        var root = new ConjunctionNode();
        root.setLeftChild(new AtomNode('a'));
        root.setRightChild(new AtomNode('b'));
        var tree = new ParsingTree(root);

        var rsNode = new RsNode([new ParsingTree(atom1), tree, new ParsingTree(atom2)]);

        var decompositionResult = rsNode.decompose();

        expect(decompositionResult.length).toEqual(2);

        expect(decompositionResult[0] instanceof RsNode).toBe(true);

        var rsNode1 = decompositionResult[0];
        var rsNode1Value = rsNode1.getValue();

        expect(rsNode1Value[0] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[0].getRoot().getValue()).toEqual('x');
        expect(rsNode1Value[1] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[1].getRoot().getValue()).toEqual('a');
        expect(rsNode1Value[2] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[2].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[2].getRoot().getValue()).toEqual('y');

        expect(decompositionResult[1] instanceof RsNode).toBe(true);

        var rsNode2 = decompositionResult[1];
        var rsNode2Value = rsNode2.getValue();

        expect(rsNode2Value.length).toEqual(3)
        expect(rsNode2Value[0] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[0].getRoot().getValue()).toEqual('x');
        expect(rsNode2Value[1] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[1].getRoot().getValue()).toEqual('b');
        expect(rsNode2Value[2] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[2].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[2].getRoot().getValue()).toEqual('y');
      });

      it("should decompose a node with [Conjunction, Atom, Atom]", function () {
        var atom1 = new AtomNode('x');
        var atom2 = new AtomNode('y');
        var root = new ConjunctionNode();
        root.setLeftChild(new AtomNode('a'));
        root.setRightChild(new AtomNode('b'));
        var tree = new ParsingTree(root);

        var rsNode = new RsNode([tree, new ParsingTree(atom1), new ParsingTree(atom2)]);

        var decompositionResult = rsNode.decompose();

        expect(decompositionResult.length).toEqual(2);

        expect(decompositionResult[0] instanceof RsNode).toBe(true);

        var rsNode1 = decompositionResult[0];
        var rsNode1Value = rsNode1.getValue();

        expect(rsNode1Value[0] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[0].getRoot().getValue()).toEqual('a');
        expect(rsNode1Value[1] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[1].getRoot().getValue()).toEqual('x');
        expect(rsNode1Value[2] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[2].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[2].getRoot().getValue()).toEqual('y');

        expect(decompositionResult[1] instanceof RsNode).toBe(true);

        var rsNode2 = decompositionResult[1];
        var rsNode2Value = rsNode2.getValue();

        expect(rsNode2Value.length).toEqual(3)
        expect(rsNode2Value[0] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[0].getRoot().getValue()).toEqual('b');
        expect(rsNode2Value[1] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[1].getRoot().getValue()).toEqual('x');
        expect(rsNode2Value[2] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[2].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[2].getRoot().getValue()).toEqual('y');
      });

      it("should decompose a node with [Atom, Atom, Conjunction]", function () {
        var atom1 = new AtomNode('x');
        var atom2 = new AtomNode('y');
        var root = new ConjunctionNode();
        root.setLeftChild(new AtomNode('a'));
        root.setRightChild(new AtomNode('b'));
        var tree = new ParsingTree(root);

        var rsNode = new RsNode([new ParsingTree(atom1), new ParsingTree(atom2), tree]);

        var decompositionResult = rsNode.decompose();

        expect(decompositionResult.length).toEqual(2);

        expect(decompositionResult[0] instanceof RsNode).toBe(true);

        var rsNode1 = decompositionResult[0];
        var rsNode1Value = rsNode1.getValue();

        expect(rsNode1Value[0] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[0].getRoot().getValue()).toEqual('x');
        expect(rsNode1Value[1] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[1].getRoot().getValue()).toEqual('y');
        expect(rsNode1Value[2] instanceof ParsingTree).toBe(true);
        expect(rsNode1Value[2].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode1Value[2].getRoot().getValue()).toEqual('a');

        expect(decompositionResult[1] instanceof RsNode).toBe(true);

        var rsNode2 = decompositionResult[1];
        var rsNode2Value = rsNode2.getValue();

        expect(rsNode2Value.length).toEqual(3)
        expect(rsNode2Value[0] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[0].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[0].getRoot().getValue()).toEqual('x');
        expect(rsNode2Value[1] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[1].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[1].getRoot().getValue()).toEqual('y');
        expect(rsNode2Value[2] instanceof ParsingTree).toBe(true);
        expect(rsNode2Value[2].getRoot() instanceof AtomNode).toBe(true);
        expect(rsNode2Value[2].getRoot().getValue()).toEqual('b');
      });

    });

  });

  describe("RsTree", function () {
    it("should construct an empty tree if no root supplied", function () {
      var tree = new RsTree();

      expect(tree.getSize()).toEqual(0);
    });
  });

  describe("createFromParsingTree", function () {


    it("should throw an error if no parsing tree has been supplied", function () {

      expect(function () {
        var resultTree = createFromParsingTree();
      }).toThrow();

      expect(function () {
        var resultTree = createFromParsingTree(null);
      }).toThrow();

      expect(function () {
        var resultTree = createFromParsingTree([]);
      }).toThrow();

      expect(function () {
        var resultTree = createFromParsingTree({});
      }).toThrow();

    });

    it("should decompose an empty tree", function () {
      var tree = new ParsingTree();

      expect(tree.getSize()).toEqual(0);

      var resultTree = createFromParsingTree(tree);

      expect(resultTree.getSize()).toEqual(0);

    });

    it("should decompose a tree with a single node", function () {
      var root = new AtomNode('a');
      var tree = new ParsingTree(root);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.getSize()).toEqual(1);
      var nodeValue = resultTree.getRoot().getValue();
      expect(nodeValue.length).toEqual(1);
      expect(nodeValue[0] instanceof ParsingTree).toBe(true);
      expect(nodeValue[0]).not.toBe(tree);

    });

    it("should decompose a tree with a single alternative", function () {
      var root = new AlternativeNode();
      root.setLeftChild(new AtomNode('a'));
      root.setRightChild(new AtomNode('b'));
      var tree = new ParsingTree(root);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.getSize()).toEqual(2);
      var rootValue = resultTree.getRoot().getValue();
      expect(rootValue.length).toEqual(1);
      expect(rootValue[0] instanceof ParsingTree).toBe(true);
      expect(rootValue[0]).not.toBe(tree);

      var leftChildValue = resultTree.getRoot().getLeftChild().getValue();
      expect(leftChildValue.length).toEqual(2);
      expect(leftChildValue[0].getRoot().getValue()).toEqual('a');
      expect(leftChildValue[1].getRoot().getValue()).toEqual('b');

      expect(resultTree.getRoot().hasRightChild()).toBe(false);

    });

    it("should decompose a tree with 2 alternatives", function () {
      var alternative1 = new AlternativeNode();
      var alternative2 = new AlternativeNode();
      alternative1.setLeftChild(new AtomNode('a'));
      alternative1.setRightChild(alternative2);
      alternative2.setLeftChild(new AtomNode('b'));
      alternative2.setRightChild(new AtomNode('c'));

      var tree = new ParsingTree(alternative1);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.getSize()).toEqual(3);
      var rootValue = resultTree.getRoot().getValue();
      expect(rootValue.length).toEqual(1);
      expect(rootValue[0] instanceof ParsingTree).toBe(true);
      expect(rootValue[0]).not.toBe(tree);

      var leftChildValue = resultTree.getRoot().getLeftChild().getValue();
      expect(leftChildValue.length).toEqual(2);
      expect(leftChildValue[0].getRoot().getValue()).toEqual('a');
      expect(leftChildValue[1].getRoot() instanceof AlternativeNode).toBe(true);

      leftChildValue = resultTree.getRoot().getLeftChild().getLeftChild().getValue();
      expect(leftChildValue.length).toEqual(3);
      expect(leftChildValue[0].getRoot().getValue()).toEqual('a');
      expect(leftChildValue[1].getRoot().getValue()).toEqual('b');
      expect(leftChildValue[2].getRoot().getValue()).toEqual('c');

      expect(resultTree.getRoot().hasRightChild()).toBe(false);
      expect(resultTree.getRoot().getLeftChild().hasRightChild()).toBe(false);

    });

    it("should decompose a tree with a single conjunction", function () {
      var root = new ConjunctionNode();
      root.setLeftChild(new AtomNode('a'));
      root.setRightChild(new AtomNode('b'));
      var tree = new ParsingTree(root);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.getSize()).toEqual(3);
      var rootValue = resultTree.getRoot().getValue();
      expect(rootValue.length).toEqual(1);
      expect(rootValue[0] instanceof ParsingTree).toBe(true);
      expect(rootValue[0]).not.toBe(tree);

      var leftChildValue = resultTree.getRoot().getLeftChild().getValue();
      expect(leftChildValue.length).toEqual(1);
      expect(leftChildValue[0].getRoot().getValue()).toEqual('a');

      var rightChildValue = resultTree.getRoot().getRightChild().getValue();
      expect(rightChildValue.length).toEqual(1);
      expect(rightChildValue[0].getRoot().getValue()).toEqual('b');


    });

    it("should decompose a tree with a single implication", function () {
      var implication = new ImplicationNode();
      implication.setLeftChild(new AtomNode('a'));
      implication.setRightChild(new AtomNode('b'));
      var tree = new ParsingTree(implication);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.getSize()).toEqual(2);
      var rootValue = resultTree.getRoot().getValue();
      expect(rootValue.length).toEqual(1);
      expect(rootValue[0] instanceof ParsingTree).toBe(true);
      expect(rootValue[0]).not.toBe(tree);

      var leftChildValue = resultTree.getRoot().getLeftChild().getValue();
      expect(leftChildValue.length).toEqual(2);
      expect(leftChildValue[0].getRoot().getValue()).toEqual('a');
      expect(leftChildValue[0].getRoot().isNegated()).toBe(true);
      expect(leftChildValue[1].getRoot().getValue()).toEqual('b');

      expect(resultTree.getRoot().hasRightChild()).toBe(false)

    });

    it("should decompose a tree with 2 conjunctions", function () {
      var conjunction1 = new ConjunctionNode();
      var conjunction2 = new ConjunctionNode();
      conjunction1.setLeftChild(new AtomNode('a'));
      conjunction1.setRightChild(conjunction2);
      conjunction2.setLeftChild(new AtomNode('b'));
      conjunction2.setRightChild(new AtomNode('c'));

      var tree = new ParsingTree(conjunction1);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.getSize()).toEqual(5);
      var rootValue = resultTree.getRoot().getValue();
      expect(rootValue.length).toEqual(1);
      expect(rootValue[0] instanceof ParsingTree).toBe(true);
      expect(rootValue[0]).not.toBe(tree);

      var leftChildValue = resultTree.getRoot().getLeftChild().getValue();
      expect(leftChildValue.length).toEqual(1);
      expect(leftChildValue[0] instanceof ParsingTree).toBe(true);
      expect(leftChildValue[0].getRoot().getValue()).toEqual('a');

      var rightChildValue = resultTree.getRoot().getRightChild().getValue();
      expect(rightChildValue.length).toEqual(1);
      expect(rightChildValue[0] instanceof ParsingTree).toBe(true);
      expect(rightChildValue[0].getRoot() instanceof ConjunctionNode).toBe(true);

      leftChildValue = resultTree.getRoot().getRightChild().getLeftChild().getValue();
      expect(leftChildValue.length).toEqual(1);
      expect(leftChildValue[0] instanceof ParsingTree).toBe(true);
      expect(leftChildValue[0].getRoot() instanceof AtomNode).toBe(true);
      expect(leftChildValue[0].getRoot().getValue()).toEqual('b');

      rightChildValue = resultTree.getRoot().getRightChild().getRightChild().getValue();
      expect(rightChildValue.length).toEqual(1);
      expect(rightChildValue[0] instanceof ParsingTree).toBe(true);
      expect(rightChildValue[0].getRoot() instanceof AtomNode).toBe(true);
      expect(rightChildValue[0].getRoot().getValue()).toEqual('c');


    });

    it("should decompose a tree with alternative and conjunction", function () {
      var alternative = new AlternativeNode();
      var conjunction = new ConjunctionNode();
      alternative.setLeftChild(new AtomNode('a'));
      alternative.setRightChild(conjunction);
      conjunction.setLeftChild(new AtomNode('b'));
      conjunction.setRightChild(new AtomNode('c'));

      var tree = new ParsingTree(alternative);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.getSize()).toEqual(4);
      var rootValue = resultTree.getRoot().getValue();
      expect(rootValue.length).toEqual(1);
      expect(rootValue[0] instanceof ParsingTree).toBe(true);
      expect(rootValue[0].getRoot() instanceof AlternativeNode).toBe(true);

      var leftChildValue = resultTree.getRoot().getLeftChild().getValue();
      expect(leftChildValue.length).toEqual(2);
      expect(leftChildValue[0] instanceof ParsingTree).toBe(true);
      expect(leftChildValue[0].getRoot() instanceof AtomNode).toBe(true);
      expect(leftChildValue[0].getRoot().getValue()).toEqual('a');
      expect(leftChildValue[1] instanceof ParsingTree).toBe(true);
      expect(leftChildValue[1].getRoot() instanceof ConjunctionNode).toBe(true);

      expect(resultTree.getRoot().hasRightChild()).toBe(false);

      leftChildValue = resultTree.getRoot().getLeftChild().getLeftChild().getValue();
      expect(leftChildValue.length).toEqual(2);
      expect(leftChildValue[0] instanceof ParsingTree).toBe(true);
      expect(leftChildValue[0].getRoot() instanceof AtomNode).toBe(true);
      expect(leftChildValue[0].getRoot().getValue()).toEqual('a');
      expect(leftChildValue[1] instanceof ParsingTree).toBe(true);
      expect(leftChildValue[1].getRoot() instanceof AtomNode).toBe(true);
      expect(leftChildValue[1].getRoot().getValue()).toEqual('b');

      var rightChildValue = resultTree.getRoot().getLeftChild().getRightChild().getValue();
      expect(rightChildValue.length).toEqual(2);
      expect(rightChildValue[0] instanceof ParsingTree).toBe(true);
      expect(rightChildValue[0].getRoot() instanceof AtomNode).toBe(true);
      expect(rightChildValue[0].getRoot().getValue()).toEqual('a');
      expect(rightChildValue[1] instanceof ParsingTree).toBe(true);
      expect(rightChildValue[1].getRoot() instanceof AtomNode).toBe(true);
      expect(rightChildValue[1].getRoot().getValue()).toEqual('c');
    });

  });

  describe("isProof", function () {
    it("empty tree is not a proof", function () {
      var tree = new ParsingTree();

      var resultTree = createFromParsingTree(tree);

      expect(resultTree.isProof()).toBe(false);

    });

    it("tree with single formula is not a proof", function () {
      var root = new AtomNode('a');
      var tree = new ParsingTree(root);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.isProof()).toBe(false);

    });

    it("tree for (a OR ~a) is a proof", function () {
      var root = new AlternativeNode();
      root.setLeftChild(new AtomNode('a'));
      root.setRightChild(new AtomNode('a', true));
      var tree = new ParsingTree(root);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.isProof()).toBe(true);

    });

    it("tree for (a OR a) is not a proof", function () {
      var root = new AlternativeNode();
      root.setLeftChild(new AtomNode('a'));
      root.setRightChild(new AtomNode('a'));
      var tree = new ParsingTree(root);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.isProof()).toBe(false);

    });

  });

  describe("isSatisfiable", function () {
    it("empty tree is not satisfiable", function () {
      var tree = new ParsingTree();

      var resultTree = createFromParsingTree(tree);

      expect(resultTree.isSatisfiable()).toBe(false);
    });

    it("a single formula is satisfiable", function () {
      var root = new AtomNode('a');
      var tree = new ParsingTree(root);

      var resultTree = createFromParsingTree(tree);

      expect(resultTree.isSatisfiable()).toBe(true);
    });

    it("tree for (a OR a) is satisfiable", function () {
      var root = new AlternativeNode();
      root.setLeftChild(new AtomNode('a'));
      root.setRightChild(new AtomNode('a'));
      var tree = new ParsingTree(root);
      var resultTree = createFromParsingTree(tree);

      expect(resultTree.isSatisfiable()).toBe(true);

    });

    it("tree for (a AND ~a) is not satisfiable", function () {
      var root = new ConjunctionNode();
      root.setLeftChild(new AtomNode('a'));
      root.setRightChild(new AtomNode('a', true));
      var tree = new ParsingTree(root);

      var resultTree = createFromParsingTree(tree);
      expect(resultTree.isSatisfiable()).toBe(false);

    });
  });
  

});