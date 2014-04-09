var tree = require('./tree');
var parsingTree = require('./parsingTree');
var AtomNode = require('./parsingTree').AtomNode;
var _ = require('lodash');

function RsNode(value){

  if (typeof value == 'undefined'){
    value = [];
  } else if (!_.isArray(value)) {
    throw new Error('Only an array can be a value of RsNode');
  }

  tree.Node.call(this, value);

  this.isDecomposable = function () {
    if ( !this.getValue() ){
      return false;
    }

    return this.getValue().some(isFormulaDecomposable)

  };

  function isFormulaDecomposable(formula){
    return !(formula instanceof AtomNode);
  }

  this.decompose = function () {
    var formulas = this.getValue();
    var formulaToDecompose;
    for (var indexOfFormula = 0, len = formulas.length; indexOfFormula < len; indexOfFormula++){
      if (isFormulaDecomposable(formulas[indexOfFormula])){
        formulaToDecompose = formulas[indexOfFormula];
        break;
      }
    }

    if (_.isUndefined(formulaToDecompose)){
      throw new Error('No decomposable formula has been found');
    }

    var previousFormulas = formulas.slice(0, indexOfFormula);
    var nextFormulas = formulas.slice(indexOfFormula + 1);

    var leftChild;
    var rightChild;

    if (formulaToDecompose instanceof parsingTree.AlternativeNode){

      leftChild = previousFormulas
        .concat([formulaToDecompose.getLeftChild(), formulaToDecompose.getRightChild()])
        .concat(nextFormulas);

      return [new RsNode(leftChild)];
    }

    if (formulaToDecompose instanceof parsingTree.ConjunctionNode){
      leftChild = previousFormulas
        .concat([formulaToDecompose.getLeftChild()])
        .concat(nextFormulas);

      rightChild = previousFormulas
        .concat([formulaToDecompose.getRightChild()])
        .concat(nextFormulas);

      return [new RsNode(leftChild), new RsNode(rightChild)];
    }

    if (formulaToDecompose instanceof parsingTree.ImplicationNode){

      var leftSubtree = formulaToDecompose.getLeftSubtree();
      leftSubtree.negate();

      leftChild = previousFormulas
        .concat([leftSubtree.getRoot(), formulaToDecompose.getRightChild()])
        .concat(nextFormulas);

      return [new RsNode(leftChild)];
    }

  };

}

RsNode.prototype = new tree.Node();

function RsTree(value){

  if (_.isUndefined(value)){
    tree.Tree.call(this);
    return;
  }

  if (!_.isArray(value)){
    value = [value];
  }

  tree.Tree.call(this, new RsNode(value));
}

RsTree.prototype = new tree.Tree();

function createFromParsingTree(parsingTree){

  if (!parsingTree || !(parsingTree instanceof tree.Tree)){
    throw new Error('No parsing tree supplied');
  }

  if (parsingTree.getSize() == 0) {
    return new RsTree();
  }

  var rsTree = new RsTree(parsingTree.getRoot());

  return decompose(rsTree);

}

function decompose(tree){
  var root = tree.getRoot();

  if (root.isDecomposable()){
    var decompositionResult = root.decompose();

    if (decompositionResult[0]) {
      root.setLeftChild(decompositionResult[0]);
    }

    if (decompositionResult[1]) {
      root.setRightChild(decompositionResult[1]);
    }

    if (root.hasLeftChild()){
      decompose(root.getLeftSubtree());
    }

    if (root.hasRightChild()){
      decompose(root.getRightSubtree());
    }
  }

  return tree;
}

module.exports = {
  RsTree: RsTree,
  RsNode: RsNode,
  createFromParsingTree: createFromParsingTree
};