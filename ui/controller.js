angular.module('rs-proof')
  .controller('MainCtrl', function ($scope) {

    var Parser = require('../src/parser/parser').Parser;
    var createFromParsingTree = require('../src/rsTree').createFromParsingTree;

    $scope.formula = 'a + b';
    $scope.rsTree = null;

    $scope.testFormula = function () {
      var parser = new Parser();
      var parsingTree = parser.parse($scope.formula);
      $scope.rsTree = createFromParsingTree(parsingTree);
    };
  });