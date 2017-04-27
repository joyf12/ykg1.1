angular.module('commendqr.controller', ['ionic','ykg.services'])
.controller('commendqrCtrl', [
    'toggleFty',
    '$scope',
    'postDataFty',
    'GlobalVariable',
    'getCurrentUserFty',
    'Message',
    function(
        toggleFty,
        $scope,
        postDataFty,
        GlobalVariable,
        getCurrentUserFty,
        Message
        ){
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
         viewData.enableBack = true;
         getCommendCode();
    });

     $scope.userInfo = {};
    function getCommendCode(){
            //获取用户信息
            $scope.userInfo = getCurrentUserFty.getCurrentUser();
            // alert(typeof $scope.userInfo.info.phone)
            $scope.userInfo.info.phone=$scope.userInfo.info.phone.replace(/(\d{3})(\d{4})(\d{4})/g,'$1 $2 $3');
            var url = GlobalVariable.SERVER_PATH + 'Person/tg/';
            var parmas = {
                // id:userInfo.info.userid
                id:1
                // rand:userInfo.rand
            }

        //取推荐二维码
        postDataFty.postData(parmas,url).then(
            function(data){
                $scope.data = data.ok;
                if(data.ok){
                    //把请求回来的图片的地址赋值给qr
                    $scope.qr = data.ok;

                }else{
                    Message.show('参数不全',1000);
                }
            },function(error){
                Message.show('数据请求失败',2000);
            })
        }
}])