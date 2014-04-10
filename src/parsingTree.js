var Tree = require('./tree').Tree;
var Node = require('./tree').Node;
var _ = require('lodash');

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

ParsingTree.prototype.toString = function () {
  return this.getRoot().toString();
};

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

AtomNode.prototype.toString = function () {

  var negation = this.isNegated() ? '!' : '';

  return negation + this.getValue().toString();
};

function ConjunctionNode(value) {
  FormulaNode.call(this, value);
}

ConjunctionNode.prototype = new FormulaNode();

ConjunctionNode.prototype.toString = function () {
  return this.getLeftSubtree().toString() + ' * ' + this.getRightSubtree().toString();
}

function AlternativeNode(value) {
  FormulaNode.call(this, value);
}

AlternativeNode.prototype = new FormulaNode();

AlternativeNode.prototype.toString = function () {
  return this.getLeftSubtree().toString() + ' + ' + this.getRightSubtree().toString();
}

function ImplicationNode(value) {
  FormulaNode.call(this, value);
}

ImplicationNode.prototype = new FormulaNode();

ImplicationNode.prototype.toString = function () {
  return this.getLeftSubtree().toString() + ' => ' + this.getRightSubtree().toString();
}

function createFromParsingQueue(parsingQueue){

  var token,
    arg1 = null,
    arg2 = null,
    resultStack = [];

  while (!_.isUndefined(token = parsingQueue.shift())){
    if (token.type == 2){
      resultStack.push(new AtomNode(token.value));
    } else if (token.type == 73){
      arg1 = resultStack.pop();
      arg1.negate();
      resultStack.push(arg1)
    } else if (token.type == 65) {
      var alternative = new AlternativeNode();
      arg2 = resultStack.pop();
      arg1 = resultStack.pop();
      alternative.setLeftChild(arg1);
      alternative.setRightChild(arg2);
      resultStack.push(alternative);
    } else if (token.type == 67) {
      var conjunction = new ConjunctionNode();
      arg2 = resultStack.pop();
      arg1 = resultStack.pop();
      conjunction.setLeftChild(arg1);
      conjunction.setRightChild(arg2);
      resultStack.push(conjunction);
    } else if (token.type == 74) {
      var conjunction = new ImplicationNode();
      arg2 = resultStack.pop();
      arg1 = resultStack.pop();
      conjunction.setLeftChild(arg1);
      conjunction.setRightChild(arg2);
      resultStack.push(conjunction);
    }

  }

  return new ParsingTree(resultStack.pop());

}

module.exports = {
  ParsingTree: ParsingTree,
  FormulaNode: FormulaNode,
  AtomNode: AtomNode,
  ConjunctionNode: ConjunctionNode,
  AlternativeNode: AlternativeNode,
  ImplicationNode: ImplicationNode,
  createFromParsingQueue: createFromParsingQueue
};