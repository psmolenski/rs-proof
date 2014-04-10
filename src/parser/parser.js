var shunt = require('../../lib/shunt');
var parsingTree = require('./../parsingTree');

function Parser() {

  this.parse = function(expression){

    var shuntParser = new shunt.Parser(new shunt.Scanner(expression));
    var parsingQueue = shuntParser.queue;

    return parsingTree.createFromParsingQueue(parsingQueue);
  };

}

module.exports = {
  Parser: Parser
};