var Node = require('./tree').Node;


function AtomNode(value) {
  Node.call(this, value);
}

AtomNode.prototype = new Node();

function ConjunctionNode(value) {
  Node.call(this, value);
}

ConjunctionNode.prototype = new Node();

function AlternativeNode(value) {
  Node.call(this, value);
}

AlternativeNode.prototype = new Node();

function ImplicationNode(value) {
  Node.call(this, value);
}

ImplicationNode.prototype = new Node();

module.exports = {
  AtomNode: AtomNode,
  ConjunctionNode: ConjunctionNode,
  AlternativeNode: AlternativeNode,
  ImplicationNode: ImplicationNode
};