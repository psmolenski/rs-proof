var tree = require('./tree.js');
var Node = tree.Node;
var Tree = tree.Tree;
var AtomNode = tree.AtomNode;
var ConjunctionNode = tree.ConjunctionNode;
var AlternativeNode = tree.AlternativeNode;
var ImplicationNode = tree.ImplicationNode;

function Parser() {

  var parsers = [new ImplicationParser(), new AlternativeParser(), new ConjunctionParser(), new AtomParser()];

  this.parse = function(str){

    var parsingTree = new Tree(str);

    try {

      for (var parser, i = 0, len = parsers.length; i < len; i++){
        parser = parsers[i];

        if (!parsingTree.getRoot().hasChildren()){
          parsingTree = parser.parse(parsingTree.getRoot().getValue());

          if (parsingTree.getSize() === 0){
            return parsingTree;
          }

        } else {

          this.parseTree(parsingTree, parser);

        }

      }

    } catch (e){
      throw new Error('Parsing error: ' + e.message);
    }

    return parsingTree;

  };

  this.parseTree = function(tree, parser){

    var root = tree.getRoot();

    if (root.hasLeftChild()) {
      if (!root.getLeftChild().hasChildren()){
        root.setLeftSubtree(parser.parse(root.getLeftChild().getValue()));
      } else {
        this.parseTree(root.getLeftSubtree(), parser);
      }
    }

    if (root.hasRightChild()) {
      if (!root.getRightChild().hasChildren()){
        root.setRightSubtree(parser.parse(root.getRightChild().getValue()));
      } else {
        this.parseTree(root.getLeftSubtree(), parser);
      }
    }
  };

}

function AtomParser() {

  this.parse = function(str){
    if (!str) {
      return new Tree();
    } else {
      return new Tree(new AtomNode(str));
    }
  }
}

function OperatorParser(operator, NodeClass) {

  var operatorPattern = ' ' + operator + ' ';

  this.parse = function(str){

    if (!str) {
      return new Tree();
    }

    var operatorIndex = str.lastIndexOf(operatorPattern);

    if (operatorIndex === -1){
      return new Tree(str);
    }

    var leftSubstring = str.slice(0, operatorIndex);
    var rightSubstring = str.slice(operatorIndex + operatorPattern.length);

    if (!leftSubstring || !rightSubstring) {
      throw new Error('Conjunction parsing error');
    }

    var root = new NodeClass(operator);

    var leftSubtree = this.parse(leftSubstring);
    root.setLeftSubtree(leftSubtree);

    root.setRightSubtree(new Tree(rightSubstring));

    return new Tree(root);

  };
}

function ConjunctionParser() {}
ConjunctionParser.prototype = new OperatorParser('AND', ConjunctionNode);

function AlternativeParser() {}
AlternativeParser.prototype = new OperatorParser('OR', AlternativeNode);

function ImplicationParser() {}
ImplicationParser.prototype = new OperatorParser('=>', ImplicationNode);

module.exports = {
  Parser: Parser,
  AtomParser: AtomParser
};