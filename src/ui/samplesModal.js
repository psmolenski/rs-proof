angular.module('rs-proof')
  .service('SamplesModal', function ($modal) {

    var formulas = ['p + !p',
      '!(p * !p)',
      'p => p',
      '(p => !p) => !p',
      '(!p => p) => p',
      'p => (q => p)',
      '!p => (p => q)',
      '(p * q) => p',
      'p => (p+q)',
      '(p => (q*!q)) => !p',
      '((p => q) * (q => r)) => (p => r)',
      '(p => (q => r)) => (q => (p => r))',
      '(p => (q => r)) => ((p * q) => r)',
      '((p => r) * (q => r)) => ((p + q) => r)',
      '((p => r) * (q => s)) => ((p + q) => (r + s))',
      '((p => r) * (q => s))=>((p * q) => (r * s))',
      '(p => (q * r)) => ((p => q) * (p => r))',
      '(p => !q) => (q => !p)'];

    function SamplesModalCtrl($scope, $modalInstance, formulas) {
      $scope.formulas = formulas;
    }


    var options = {
      templateUrl: 'rs-proof.SamplesModal',
      controller: SamplesModalCtrl,
      resolve: {
        formulas: function () {
          return formulas;
        }
      }
    };

     return {
       open: function () {
         return $modal.open(options);
       }
     }
  });