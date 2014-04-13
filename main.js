var Parser = require('./src/parser/parser').Parser;
var createFromParsingTree = require('./src/rsTree').createFromParsingTree;

var expression = process.argv.slice(2).join(' ');


var parser = new Parser();
var parsingTree = parser.parse(expression);
var rsTree = createFromParsingTree(parsingTree);

if (rsTree.isProof()) {
  process.stdout.write('Formula is valid\n');
  process.stdout.write('RS decomposition tree:\n');
  process.stdout.write(rsTree.toString() + '\n');
} else if (rsTree.isSatisfiable()){
  process.stdout.write('Formula is satisifiable\n');
  process.stdout.write('RS decomposition tree:\n');
  process.stdout.write(rsTree.toString() + '\n');
} else {
  process.stdout.write('Formula is not satisifiable\n');
}

