var Tree = require('./tree').Tree;
var Node = require('./tree').Node;

function ParsingTree(root){

  if (typeof root != 'undefined' && root !== null && !(root instanceof FormulaNode)){
    root = new FormulaNode(root);
  }

  Tree.call(this, root);

  this.negate = function () {

    this.setRoot(this.negateTree(this).getRoot());

  };

  this.negateTree = function (tree) {

    var root = tree.getRoot();
    var newRoot;

    if (root instanceof AlternativeNode) {

      newRoot = new ConjunctionNode();
      newRoot.setLeftChild(root.getLeftChild());
      newRoot.setRightChild(root.getRightChild());

      newRoot.setLeftSubtree(this.negateTree(newRoot.getLeftSubtree()));
      newRoot.setRightSubtree(this.negateTree(newRoot.getRightSubtree()));

    } else if (root instanceof ConjunctionNode) {

      newRoot = new AlternativeNode();
      newRoot.setLeftChild(root.getLeftChild());
      newRoot.setRightChild(root.getRightChild());

      newRoot.setLeftSubtree(this.negateTree(newRoot.getLeftSubtree()));
      newRoot.setRightSubtree(this.negateTree(newRoot.getRightSubtree()));

    } else if (root instanceof ImplicationNode) {

      newRoot = new ConjunctionNode();
      newRoot.setLeftChild(root.getLeftChild());
      newRoot.setRightChild(root.getRightChild());

      newRoot.setRightSubtree(this.negateTree(newRoot.getRightSubtree()));

    } else if (root instanceof AtomNode) {
      root.negate();
      newRoot = root;
    }

    tree.setRoot(newRoot);

    return tree;

  };

}

ParsingTree.prototype = new Tree();

function FormulaNode(value) {
  Node.call(this, value);

  this.getLeftSubtree = function () {
    return new ParsingTree(this.getLeftChild());
  };

  this.getRightSubtree = function () {
    return new ParsingTree(this.getRightChild());
  }
}

FormulaNode.prototype = new Node();

function AtomNode(value, negated) {
  FormulaNode.call(this, value);

  var _negated = !!negated;

  this.isNegated = function () {
    return _negated;
  };

  this.negate = function () {
    _negated = !_negated;
  }
}

AtomNode.prototype = new FormulaNode();

function ConjunctionNode(value) {
  FormulaNode.call(this, value);
}

ConjunctionNode.prototype = new FormulaNode();

function AlternativeNode(value) {
  FormulaNode.call(this, value);
}

AlternativeNode.prototype = new FormulaNode();

function ImplicationNode(value) {
  FormulaNode.call(this, value);
}

ImplicationNode.prototype = new FormulaNode();

module.exports = {
  ParsingTree: ParsingTree,
  FormulaNode: FormulaNode,
  AtomNode: AtomNode,
  ConjunctionNode: ConjunctionNode,
  AlternativeNode: AlternativeNode,
  ImplicationNode: ImplicationNode
};