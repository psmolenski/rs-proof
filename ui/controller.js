angular.module('rs-proof')
  .controller('MainCtrl', function ($scope, SamplesModal) {

    var Parser = require('../src/parser/parser').Parser;
    var createFromParsingTree = require('../src/rsTree').createFromParsingTree;

    $scope.formula = null;
    $scope.rsTree = null;

    $scope.testFormula = function () {

      if (!$scope.formula){
        return;
      }

      var parser = new Parser();
      var parsingTree = parser.parse($scope.formula);
      $scope.rsTree = createFromParsingTree(parsingTree);
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