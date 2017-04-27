
angular.module('wechat.controller', ['ykg.services','global'])
  .controller('wechatCtrl', ['$scope',
    'postDataFty',
    'getCurrentUserFty',
    '$state',
    'GlobalVariable',
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
    Message,
    $ionicHistory,
    $timeout,
    Storage
        ) {
      
        var userInfo = getCurrentUserFty.getCurrentUser();
        $scope.userAccount = Storage.get('account');
        $scope.account = {
            wechat:null,
            buttonText:'提交',
            buttonState:true,
            filled: $scope.userAccount.info.weixingid != null &&  $scope.userAccount.info.weixingid != ''

        };

        alert($scope.account.filled)
        
        $scope.wechat = function(){
            
            var params ={
                id:userInfo.info.userid,
                // rand:userInfo.rand,
                wechat:$scope.account.wechat?$scope.account.wechat:null
            } 
            // alert(angular.toJson(params))
            var url = GlobalVariable.SERVER_PATH +'info/wechat';
            postDataFty.postData(params, url).then(
                function(data){
                    if(!$scope.account.buttonState){//如果按钮变了成功，再次点击返回设置页
                        $ionicHistory.goBack();
                    }else{
                       if(data.ok){
                           $scope.account.buttonText = '成功,2秒后返回';
                           $scope.account.buttonState = false;
                           Message.show('成功,2秒后返回',1600, function(){
                            $timeout(function(){
                                $ionicHistory.goBack();
                            },2000)
                           })

                       }else if(data.error){
                           Message.show(data.error, 1600);
                            $scope.account.buttonState = true;
                       };
                        
                    }
                        

                },function(error){
                    Message.show('网络出错了，稍候再试', 1600)
                    // alert('error'+error)
                })
        }

        $scope.$on('$ionicView.beforeEnter', function(event, viewData){
            viewData.enableBack = true;
        })
   

  }]);
