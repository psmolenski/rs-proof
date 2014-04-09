var tree = require('./tree');
var parsingTree = require('./parsingTree');
var ParsingTree = parsingTree.ParsingTree;
var AtomNode = parsingTree.AtomNode;
var ConjunctionNode = parsingTree.ConjunctionNode;
var AlternativeNode = parsingTree.AlternativeNode;
var ImplicationNode = parsingTree.ImplicationNode;

function Parser() {

  var parsers = [new ImplicationParser(), new AlternativeParser(), new ConjunctionParser(), new AtomParser()];

  this.parse = function(str){

    var resultParsingTree = new ParsingTree(str);

    try {

      for (var parser, i = 0, len = parsers.length; i < len; i++){
        parser = parsers[i];

        if (!resultParsingTree.getRoot().hasChildren()){
          resultParsingTree = parser.parse(resultParsingTree.getRoot().getValue());

          if (resultParsingTree.getSize() === 0){
            return resultParsingTree;
          }

        } else {

          this.parseTree(resultParsingTree, parser);

        }

      }

    } catch (e){
      throw new Error('Parsing error: ' + e.message);
    }

    return resultParsingTree;

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
        this.parseTree(root.getRightSubtree(), parser);
      }
    }
  };

}

function AtomParser() {

  this.parse = function(str){
    if (!str) {
      return new ParsingTree();
    }

    var negationsCount = countNegations(str);
    var node = new AtomNode(str.slice(negationsCount));

    if (negationsCount % 2) {
      node.negate();
    }

    return new ParsingTree(node);
  };

  function countNegations(str){
    var match = str.match(/^~*/);

    return match[0].length;
  }
}

function OperatorParser(operator, NodeClass) {

  var operatorPattern = ' ' + operator + ' ';

  this.parse = function(str){

    if (!str) {
      return new ParsingTree();
    }

    var operatorIndex = str.lastIndexOf(operatorPattern);

    if (operatorIndex === -1){
      return new ParsingTree(str);
    }

    var leftSubstring = str.slice(0, operatorIndex);
    var rightSubstring = str.slice(operatorIndex + operatorPattern.length);

    if (!leftSubstring || !rightSubstring) {
      throw new Error('Conjunction parsing error');
    }

    var root = new NodeClass(operator);

    var leftSubtree = this.parse(leftSubstring);
    root.setLeftSubtree(leftSubtree);

    root.setRightSubtree(new ParsingTree(rightSubstring));

    return new ParsingTree(root);

  };
}

function ConjunctionParser() {}
ConjunctionParser.prototype = new OperatorParser('AND', ConjunctionNode);

function AlternativeParser() {}
AlternativeParser.prototype = new OperatorParser('OR', AlternativeNode);

function ImplicationParser() {}
ImplicationParser.prototype = new OperatorParser('=>', ImplicationNode);

module.exports = {
  Parser: Parser
};