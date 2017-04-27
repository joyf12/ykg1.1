
angular.module('goodsManager.controller', ['ykg.services','global'])
  .controller('goodsManagerCtrl', ['$scope',
    'postDataFty',
    'getCurrentUserFty',
    '$state',
    'GlobalVariable',
    'getCurrentUserFty',
    'Message',
    '$ionicHistory',
    '$timeout',
    'Storage',
    function (
    $scope,
    postDataFty,
    getCurrentUserFty,
    $state,
    GlobalVariable,
    getCurrentUserFty,
    Message,
    $ionicHistory,
    $timeout,
    Storage
        ){
      $scope.goodsInfo = {
        
      }
        
   

  }]);
