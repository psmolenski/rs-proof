describe('tree', function () {

  var Tree = require('../src/tree.js').Tree;
  var Node = require('../src/tree.js').Node;
  var AtomNode = require('../src/parsingTree.js').AtomNode;
  var AlternativeNode = require('../src/parsingTree.js').AlternativeNode;
  var ConjunctionNode = require('../src/parsingTree.js').ConjunctionNode;

  describe("Tree", function () {
    describe("constructor", function () {
      it("should construct an empty tree if no aguments are passed to constructor", function () {
        var tree = new Tree();
        expect(tree.getRoot()).toBeNull();
        expect(tree.getSize()).toEqual(0);
      });

      it("should construct a tree with root if node object has been passed to constructor", function () {
        var root = new Node('foo');
        var tree = new Tree(root);
        expect(tree.getRoot()).toBe(root);
        expect(tree.getSize()).toEqual(1);
      });

      it("should construct a tree with root if a value (not node) has been passed to constructor", function () {
        var tree = new Tree('foo');
        var root = tree.getRoot();
        expect(tree.getSize()).toEqual(1);
        expect(root.getValue()).toEqual('foo');
        expect(root.getLeftChild()).toBeNull();
        expect(root.getRightChild()).toBeNull();
      });

      it("should construct an empty tree if a null value has been passed to constructor", function () {
        var tree = new Tree(null);
        var root = tree.getRoot();
        expect(tree.getSize()).toEqual(0);
        expect(root).toBeNull();
      });

    });

    describe("getLeaves", function () {
      it("should return an empty array if the tree is empty", function () {
        var tree = new Tree();

        expect(tree.getLeaves().length).toEqual(0);
      });

      it("should return an array with one leave if tree has only one node", function () {
        var tree = new Tree('a');

        var leaves = tree.getLeaves();
        expect(leaves.length).toEqual(1);
        expect(leaves[0].getValue()).toEqual('a');
      });

      /*
        A
        |
        B
       */

      it("should return an array with one leave if tree has 2 nodes", function () {
        var parent = new Node('a');
        var child = new Node('b');
        parent.setLeftChild(child);
        var tree = new Tree(parent);

        var leaves = tree.getLeaves();
        expect(leaves.length).toEqual(1);
        expect(leaves[0].getValue()).toEqual('b');
      });

      /*
        A
        |
      B----C
       */

      it("should return an array with one leave if tree has 3 nodes", function () {
        var parent = new Node('a');
        var leftChild = new Node('b');
        var rightChild = new Node('c');
        parent.setLeftChild(leftChild);
        parent.setRightChild(rightChild);
        var tree = new Tree(parent);

        var leaves = tree.getLeaves();
        expect(leaves.length).toEqual(2);
        expect(leaves[0].getValue()).toEqual('b');
        expect(leaves[1].getValue()).toEqual('c');
      });

    });

    describe("copy", function () {
      it("should copy an empty tree", function () {
        var tree = new Tree();
        var treeCopy = tree.copy();

        expect(treeCopy instanceof Tree).toBe(true);
        expect(treeCopy).not.toBe(tree);
        expect(treeCopy.hasRoot()).toBe(false);

      });

      it("should copy a tree with a root", function () {
        var root = new Node('foo');
        var tree = new Tree();
        tree.setRoot(root);
        var treeCopy = tree.copy();

        expect(treeCopy instanceof Tree).toBe(true);
        expect(treeCopy.getSize()).toEqual(1);
        expect(treeCopy).not.toBe(tree);
        expect(treeCopy.getRoot()).not.toBe(root);
        expect(treeCopy.getRoot().getValue()).toEqual(root.getValue());

      });

      it("should copy a tree with a root", function () {
        var root = new Node('foo');
        var nodeLeft = new Node('bar');
        var nodeRight = new Node('bazz');
        root.setLeftChild(nodeLeft);
        root.setRightChild(nodeRight);
        var tree = new Tree();
        tree.setRoot(root);
        var treeCopy = tree.copy();

        expect(treeCopy instanceof Tree).toBe(true);
        expect(treeCopy.getSize()).toEqual(3);
        expect(treeCopy).not.toBe(tree);
        
        var rootCopy = treeCopy.getRoot();
        
        expect(rootCopy).not.toBe(root);
        expect(rootCopy.getValue()).toEqual(root.getValue());
        
        var nodeLeftCopy = rootCopy.getLeftChild();
        
        expect(nodeLeftCopy).not.toBe(nodeLeft);
        expect(nodeLeftCopy.getValue()).toEqual(nodeLeft.getValue());


        var nodeRightCopy = rootCopy.getRightChild();

        expect(nodeRightCopy).not.toBe(nodeRight);
        expect(nodeRightCopy.getValue()).toEqual(nodeRight.getValue());

      });

    });
  });

  describe("Node", function () {
    describe("constructor", function () {
      it("should create an empty node if no arguments have been passed to constructor", function () {
        var node = new Node();

        expect(node.getValue()).toBeNull();
        expect(node.getLeftChild()).toBeNull();
        expect(node.getRightChild()).toBeNull();

      });
      it("should create a node with value if value has been passed to constructor", function () {
        var node = new Node('foo');

        expect(node.getValue()).toEqual('foo');
        expect(node.getLeftChild()).toBeNull();
        expect(node.getRightChild()).toBeNull();

      });
    });
    describe("copy", function () {
      it("should copy an empty node", function () {
        var node = new Node();
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof Node).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getValue()).toEqual(node.getValue());
      });

      it("should copy a node with a value", function () {
        var node = new Node('foo');
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof Node).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getValue()).toEqual(node.getValue());
      });

      it("should copy a node with a value which is a reference", function () {
        var obj = {};
        var node = new Node(obj);
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof Node).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getValue()).toBe(node.getValue());
      });

      it("should copy a node together with its children", function () {
        var node = new Node('foo');
        var nodeLeft = new Node('bar');
        var nodeRight = new Node('bazz');
        node.setLeftChild(nodeLeft);
        node.setRightChild(nodeRight);
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof Node).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getLeftChild()).not.toBe(nodeLeft);
        expect(nodeCopy.getLeftChild().getValue()).toEqual(nodeLeft.getValue());

        expect(nodeCopy.getRightChild()).not.toBe(nodeRight);
        expect(nodeCopy.getRightChild().getValue()).toEqual(nodeRight.getValue());
      });

      it("should copy a node together with its children (left child only)", function () {
        var node = new Node('foo');
        var nodeLeft = new Node('bar');
        node.setLeftChild(nodeLeft);
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof Node).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.getLeftChild()).not.toBe(nodeLeft);
        expect(nodeCopy.getLeftChild().getValue()).toEqual(nodeLeft.getValue());

        expect(nodeCopy.hasRightChild()).toBe(false);
      });

      it("should copy a node together with its children (right child only)", function () {
        var node = new Node('foo');
        var nodeRight = new Node('bazz');
        node.setRightChild(nodeRight);
        var nodeCopy = node.copy();

        expect(nodeCopy instanceof Node).toBe(true);

        expect(nodeCopy).not.toBe(node);

        expect(nodeCopy.hasLeftChild()).toBe(false);

        expect(nodeCopy.getRightChild()).not.toBe(nodeRight);
        expect(nodeCopy.getRightChild().getValue()).toEqual(nodeRight.getValue());
      });
    });
  });

});