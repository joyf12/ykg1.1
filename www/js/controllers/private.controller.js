angular.module('private.controller', ['ykg.services'])
  .controller('privateCtrl', [
    '$scope',
    function (
        $scope
       ) {
        //返回按钮
        $scope.$on('$ionicView.beforeEnter', function(event,viewData){
            viewData.enableBack = true;
        });

    }]);
