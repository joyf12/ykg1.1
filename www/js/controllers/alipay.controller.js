
angular.module('alipay.controller', ['ykg.services','global'])
  .controller('alipayCtrl', ['$scope',
    'getDataFty',
    'getCurrentUserFty',
    '$state',
    'GlobalVariable',
    function (
    $scope,
    getDataFty,
    getCurrentUserFty,
    $state,
    GlobalVariable
        ) {
        // var userInfo = getCurrentUserFty.getCurrentUser('logined');
        var userInfo = {};
        $scope.account = {
            alipay:null,
            buttonText:'提交',
            buttonState:true,
            filled:userInfo.zhifubao

        };
        
        $scope.alipay = function(){
            
            var params ={
                uid:userInfo.id,
                rand:userInfo.rand,
                zfb:$scope.account.alipay?$scope.account.alipay:null
            } 
            // alert(angular.toJson(params))
            var url = GlobalVariable.SERVER_PATH +' Home/Index/alipay/';
            getDataFty.getData(params, url).then(
                function(data){
                    if(!$scope.account.buttonState){//如果按钮变了成功，再次点击返回设置页
                        $state.go('finishYourInfo');
                    }
                   switch(data.error){
                        case '1':
                        Message.show('你的帐号已在其他设备上登录，请重新登录',1200,function(){
                            $state.go('login')
                        });
                        break;

                        case '2':
                        Message.show('信息好像不完整，请检查后再提交');
                        break;
                    };

                    if(data.state){
                        $scope.account.buttonText = '成功，返回认证其他信息';
                        $scope.account.buttonState = false;

                    }


                },function(error){
                    alert('error'+error)
                })
        }
   

  }]);
