function Node(value){
  var _value,
    _leftChild = null,
    _rightChild = null;

  this.getValue = function(){
    return _value;
  };

  this.setValue = function (newValue) {
    _value = newValue;
  };

  this.getLeftChild = function () {
    return _leftChild;
  };

  this.setLeftChild = function (newLeftChild) {
    _leftChild = newLeftChild;
  };

  this.getLeftSubtree = function () {
    return new Tree(_leftChild);
  };

  this.setLeftSubtree  = function (leftSubtree ) {
    this.setLeftChild(leftSubtree.getRoot()) ;
  };

  this.hasLeftChild= function(){
    return !!this.getLeftChild();
  };

  this.getRightChild = function () {
    return _rightChild;
  };

  this.setRightChild = function (newRightChild) {
    _rightChild = newRightChild;
  };

  this.hasLeftChild = function(){
    return !!this.getLeftChild();
  };

  this.getRightSubtree = function () {
    return new Tree(_rightChild);
  };

  this.setRightSubtree = function (newRightSubtree) {
    this.setRightChild(newRightSubtree.getRoot());
  };

  this.hasRightChild = function () {
    return !!this.getLeftChild();
  };

  this.hasChildren = function () {
    return this.hasLeftChild() || this.hasRightChild();
  };

  if (typeof value == 'undefined'){
    this.setValue(null);
  } else {
    this.setValue(value);
  }

}

function AtomNode(value){
  Node.call(this, value);
}

AtomNode.prototype = new Node();



function ConjunctionNode(value){
  Node.call(this, value);
}

ConjunctionNode.prototype = new Node();

function AlternativeNode(value){
  Node.call(this, value);
}

AlternativeNode.prototype = new Node();

function ImplicationNode(value){
  Node.call(this, value);
}

ImplicationNode.prototype = new Node();

function Tree(root){
  var _rootNode;

  this.getRoot = function () {
    return _rootNode;
  };

  this.setRoot = function (newRoot) {
    _rootNode = newRoot;
  };

  this.hasRoot = function () {
    return !!this.getRoot();
  };

  this.getSize = function () {
    if (!this.hasRoot()){
      return 0;
    }

    var leftSubtreeSize = this.getRoot().hasLeftChild() ? this.getRoot().getLeftSubtree().getSize() : 0;
    var rightSubtreeSize = this.getRoot().hasRightChild() ? this.getRoot().getRightSubtree().getSize() : 0;

    return 1 + leftSubtreeSize + rightSubtreeSize;

  };

  this.forEachNode = function (functionForNode) {
    if (!this.hasRoot()){
      return;
    }

    var stop = functionForNode(this.getRoot());

    if (!stop) {
      if (this.getRoot().hasLeftChild()){
        this.getRoot().getLeftSubtree().forEachNode(functionForNode);
      }

      if (this.getRoot().hasRightChild()) {
        this.getRoot().getRightSubtree().forEachNode(functionForNode);
      }
    }
  };


  if (root instanceof Node){
    this.setRoot(root);
  } else if (typeof root != 'undefined' && root !== null){
    this.setRoot(new Node(root));
  } else {
    this.setRoot(null);
  }

}

module.exports = {
  Tree: Tree,
  Node: Node,
  AtomNode: AtomNode,
  ConjunctionNode: ConjunctionNode,
  AlternativeNode: AlternativeNode,
  ImplicationNode: ImplicationNode
};