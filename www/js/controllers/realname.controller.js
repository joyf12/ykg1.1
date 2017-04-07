
angular.module('realname.controller', [])
  .controller('realnameCtrl', ['$scope',
    function ($scope) {
        
        $scope.$on('$ionicView.beforeEnter',function(event,viewDate){
         viewDate.enableBack=true;
       })

  }]);
