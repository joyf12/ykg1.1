
angular.module('setWithdrawPS.controller', ['ykg.services', 'global'])
.controller('setWithdrawPSCtrl', [
  '$scope',
  'verificationFty',
  'postDataFty',
  'GlobalVariable',
  'getCurrentUserFty',
  'Message',
  '$location',
  function(
    $scope,
    verificationFty,
    postDataFty,
    GlobalVariable,
    getCurrentUserFty,
    Message,
    $location){

    var userinfo = getCurrentUserFty.getCurrentUser();
    userinfo.phone = Number(userinfo.info.phone);

    $scope.bindData = {
      phone:userinfo.phone,
      safeNum:null,
      safeAgain:null,
      changeBtnState:'确认更改',
      getCodeState:'获取验证码',
      buttonState:false,
      buttonWaite:false
    }

    // 手机号验证
    $scope.checkPhoneNum = function(){
      $scope.phoneErr = verificationFty.phoneNumber($scope.bindData.phone)
    }

    //验证安全码是否符合规则
    $scope.checkSafe = function(){
      $scope.safeFirst = verificationFty.password($scope.bindData.safeNum)
    }

    //验证两次输入是否一致
    $scope.checkSafeAgain = function(){
      if($scope.bindData.safeNum !== $scope.bindData.safeAgain){
        $scope.safeAgain = true;
      }else{
        $scope.safeAgain = false;
      }
    }

    //获取验证码
    var isFirst = true;
    var timer = null;
    //修改安全码
    $scope.setbindData = function(){
      if(!$scope.bindData.buttonState){
        $scope.bindData.buttonWaite = true;
        $scope.bindData.changeBtnState = '提交中...'
        
        var url = GlobalVariable.SERVER_PATH+ 'Info/setpaypsd/';
        var parmas = {//参数
          id:userinfo.info.userid,
          paypassword:$scope.bindData.safeNum
        }
        alert('参数为'+angular.toJson(parmas))
        postDataFty.postData(parmas,url).then(
          function(data){
            if(data.ok){
              Message.show('设置安全码成功',1600);
              $scope.bindData.buttonState = true;
              $scope.bindData.buttonWaite = false;
              $scope.bindData.changeBtnState = '修改成功，2秒后返回';
              $location.path('/tab/home');
            } else if(data.error){
              Message.show(data.error, 1600);
              $scope.bindData.buttonState = false;
              $scope.bindData.buttonWaite = false;
              $scope.bindData.changeBtnState = '确认更改';
            }
           
          },function(error){
            $scope.bindData.buttonState = false;
             $scope.bindData.buttonWaite = false;
            $scope.bindData.changeBtnState = '确认更改';
            Message.show('网络出错了，设置安全码失败')
          })//提交安全码

      } else{
        $location.path('/tab/home');
        $scope.bindData.buttonState= false;
      }
    };

    $scope.$on('$ionicView.beforeEnter', function(event, viewData){
      viewData.enableBack = true;
    })




  }]);
