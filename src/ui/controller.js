angular.module('rs-proof')
  .controller('MainCtrl', function ($scope, SamplesModal) {

    var Parser = require('../parser/parser').Parser;
    var createFromParsingTree = require('../rsTree').createFromParsingTree;

    $scope.formula = null;
    $scope.rsTree = null;

    $scope.testFormula = function () {

      if (!$scope.formula){
        return;
      }

      var parser = new Parser();
      try {
        var parsingTree = parser.parse($scope.formula);
        $scope.rsTree = createFromParsingTree(parsingTree);
      } catch (e) {
        alert('Parsing error');
      }
    };

    $scope.$watch('rsTree', function (tree) {
      if (tree) {
        $scope.isProof = tree.isProof();
        $scope.isSatisfiable = tree.isSatisfiable();

        if (!$scope.isProof && $scope.isSatisfiable){
          $scope.satisfyingValuations = tree.getSampleValuation();
          $scope.notSatisfyingValuations = tree.getSampleNotSatisfyingValuation();
        }

      }
    });

    $scope.checkStatus = function () {
      if ($scope.isProof){
        return 'valid';
      }

      if (!$scope.isProof && $scope.isSatisfiable){
        return 'satisfiable';
      }

      if (!$scope.isProof && !$scope.isSatisfiable){
        return 'not-satisfiable';
      }


    };

    $scope.showSamples = function () {
      SamplesModal.open().result.then(function (sampleFormula) {
        if (sampleFormula){
          $scope.formula = sampleFormula;
          $scope.testFormula();
        }
      });
    };


  });