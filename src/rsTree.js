var tree = require('./tree');
var parsingTree = require('./parsingTree');
var ParsingTree = parsingTree.ParsingTree;
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

  function isFormulaDecomposable(formulaTree){
    if (!formulaTree.hasRoot()) {
      return false;
    }

    return !(formulaTree.getRoot() instanceof AtomNode);
  }

  this.decompose = function () {
    var formulas = this.getValue();
    var formulaTreeToDecompose;
    for (var indexOfFormula = 0, len = formulas.length; indexOfFormula < len; indexOfFormula++){
      if (isFormulaDecomposable(formulas[indexOfFormula])){
        formulaTreeToDecompose = formulas[indexOfFormula];
        break;
      }
    }

    if (_.isUndefined(formulaTreeToDecompose)){
      throw new Error('No decomposable formula has been found');
    }

    var formulaRoot = formulaTreeToDecompose.getRoot();
    var previousFormulas = formulas.slice(0, indexOfFormula);
    var nextFormulas = formulas.slice(indexOfFormula + 1);

    var leftSubtree;
    var rightSubtree;

    if (formulaRoot instanceof parsingTree.AlternativeNode){

      leftSubtree = previousFormulas
        .concat([formulaRoot.getLeftSubtree(), formulaRoot.getRightSubtree()])
        .concat(nextFormulas);

      return [new RsNode(leftSubtree)];
    }

    if (formulaRoot instanceof parsingTree.ConjunctionNode){
      leftSubtree = previousFormulas
        .concat([formulaRoot.getLeftSubtree()])
        .concat(nextFormulas);

      rightSubtree = previousFormulas
        .concat([formulaRoot.getRightSubtree()])
        .concat(nextFormulas);

      return [new RsNode(leftSubtree), new RsNode(rightSubtree)];
    }

    if (formulaRoot instanceof parsingTree.ImplicationNode){

      var tmpLeftSubtree = formulaRoot.getLeftSubtree();
      tmpLeftSubtree.negate();

      leftSubtree = previousFormulas
        .concat([tmpLeftSubtree, formulaRoot.getRightSubtree()])
        .concat(nextFormulas);

      return [new RsNode(leftSubtree)];
    }

  };

}

RsNode.prototype = new tree.Node();

RsNode.prototype.isFundamental = function () {
  var formulaTries = this.getValue();

  for (var i = 0, len = formulaTries.length; i < len; i++){
    var formula = formulaTries[i].getRoot();

    for (var j = i; j < len; j++){
      if (formula.getValue() == formulaTries[j].getRoot().getValue() && formula.isNegated() != formulaTries[j].getRoot().isNegated()){
        return true;
      }
    }

  }

  return false;

};

RsNode.prototype.toString = function () {
  return '(' + this.getValue().map(function (formula) {
    return formula.toString();
  }).join(', ') + ')';
};

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

RsTree.prototype.isProof = function () {

  if (!this.hasRoot()) {
    return false;
  }

  return this.getLeaves().every(function (node) {
    return node.isFundamental();
  });
};

RsTree.prototype.isSatisfiable = function () {

  if (!this.hasRoot()){
    return false;
  } else if (this.isProof()){
    return true;
  }

  var rootValue = this.getRoot().getValue()[0].getRoot();
  var parsingTree = new ParsingTree(rootValue);
  parsingTree.negate();
  var rsTree = createFromParsingTree(parsingTree);

  return !rsTree.isProof();
};

RsTree.prototype.toString = function () {

  var str = '';

  this.bfs(function (nodesOnLevel) {
    str += '[' + nodesOnLevel.map(function (node) {
      return node.toString();
    }).join(', ') + '] \n';
  });

  return str;

};

function createFromParsingTree(parsingTree){

  if (!parsingTree || !(parsingTree instanceof ParsingTree)){
    throw new Error('No parsing tree supplied');
  }

  if (parsingTree.getSize() == 0) {
    return new RsTree();
  }

  var rsTree = new RsTree(parsingTree);

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