angular.module('safesetting.controller', [])
  .controller('safesettingCtrl', ['$scope',
    function ($scope) {
        $scope.$on('$ionicView.beforeEnter', function(event,viewData){
            viewData.enableBack = true;
        })
      
      
    }]);
