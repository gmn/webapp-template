var module_name = "ModuleName";
var controller_name = "ControllerName";

var app = angular.module( module_name, []);
app.controller( controller_name, function($scope, $filter) 
{
  $scope.items = [];
  $scope.keycount = -777;

  $scope.init = function() { 
    $scope.keycount = 0; 
    $scope.items = [];
  }

  $scope.key = function(e) {
    $scope.keycount++;
    if ( e.which === 13 ) { // RETURN / ENTER
    }
    else if ( e.which === 27 ) { // ESCAPE
    }
  };
}); 

app.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) 
    {
      scope.$watch(attrs.focusMe, function(value) 
      {
        if (value === true) 
        {
          $timeout(function() {
            element[0].focus();
          }, 300 );
        }
      });
    }
  };
});
