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
  });

});