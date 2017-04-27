angular.module('storeaccount.controller', ['ykg.services', 'global'])
.controller('storeaccountCtrl', ['$scope',
 '$state',
 '$ionicHistory',
 'postDataFty',
 'GlobalVariable',
 'Message',
 'Storage',
 'cacheFty',
   function ($scope,
    $state,
    $ionicHistory,
    postDataFty,
    GlobalVariable,
    Message,
    Storage,
    cacheFty) {
    $scope.$on('$ionicView.beforeEnter', function(event, viewData){
        viewData.enableBack = true;
    });

    function getNews () {
        var url = GlobalVariable.SERVER_PATH + 'Index/news';
        postDataFty.postData(null, url).then(function(data){
            if(data.ok){
                $scope.news = data.ok
            }
        },function(error){

        })
    };

    
    $scope.bankaccount = null;
    $scope.$on('$ionicView.afterEnter',function(){
        getNews();
        $scope.account();

    });

    $scope.account  = function(){
        var storeid = cacheFty.getCache('storeid');
        // alert(angular.toJson(storeid))
        var url = GlobalVariable.SERVER_PATH + "shop/sure/";
        var params = {id:storeid};
        postDataFty.postData(params, url).then(
          function(data){
            alert(angular.toJson(data))
            if(data.ok){
                $scope.data = data.ok[0];
                
            }else if(data.error){
                Message.show(data.error, 1600)
            }
            
          },function(error){

          }) 
        if(cacheFty.getCache('storeid') != null){
            cacheFty.remove('storeid');
        }
    };

}]);

