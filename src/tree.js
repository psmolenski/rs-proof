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
    return !!this.getRightChild();
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

  this.getLeaves = function () {
    var leaves = [];

    this.forEachNode(function (node) {
      if (!node.hasChildren()){
        leaves.push(node);
      }
    });

    return leaves;


  };

  if (root instanceof Node){
    this.setRoot(root);
  } else if (typeof root != 'undefined' && root !== null){
    this.setRoot(new Node(root));
  } else {
    this.setRoot(null);
  }

}

Tree.prototype.bfs = function (callback){
  var waitingQueue = [];
  var queue = [];
  var node;

  if (!this.hasRoot()){
    return;
  }

  waitingQueue.push(this.getRoot());

  while (waitingQueue.length > 0) {
    copyItemsFromWaitingQueueToQueue();

    callback(queue);

    while (node = queue.pop()){
      if (node.hasLeftChild()) {
        waitingQueue.push(node.getLeftChild());
      }

      if (node.hasRightChild()){
        waitingQueue.push(node.getRightChild());
      }

    }

  }

  function copyItemsFromWaitingQueueToQueue(){
    while(waitingQueue.length > 0) {
      queue.push(waitingQueue.pop());
    }
  }

};



module.exports = {
  Tree: Tree,
  Node: Node
};