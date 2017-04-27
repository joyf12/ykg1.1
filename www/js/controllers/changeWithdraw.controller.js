
angular.module('changeWithdraw.controller', ['ykg.services', 'global'])
.controller('changeWithdrawCtrl', [
  '$scope',
  '$state',
  'verificationFty',
  'postDataFty',
  'getDataFty',
  'GlobalVariable',
  '$interval',
  'getCurrentUserFty',
  'Message',
  'popupFty',
  '$location',
  function(
    $scope,
    $state,
    verificationFty,
    postDataFty,
    getDataFty,
    GlobalVariable,
    $interval,
    getCurrentUserFty,
    Message,
    popupFty,
    $location){

    var userinfo = getCurrentUserFty.getCurrentUser();
    userinfo.phone = Number(userinfo.phone);

    $scope.bindData = {
      phone:userinfo.phone,
      sms:null,
      oldSafeNum:null,
      safeNum:null,
      safeAgain:null,
      changeBtnState:'确认更改',
      getCodeState:'获取验证码',
      CodeInterval:null,
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
    $scope.getCode = function () {
      if(isFirst){
        $scope.bindData.CodeInterval = 60;
        $interval.cancel(timer);//避免定时器叠加
        timer = $interval(function () {
          if ($scope.bindData.CodeInterval <= 0) {
            $interval.cancel(timer);
            $scope.bindData.CodeInterval=60;
            $scope.bindData.getCodeState = '获取验证码'
            $scope.bindData.CodeInterval = null;
            isFirst = true;

          } else {
            $scope.bindData.CodeInterval--;
            $scope.bindData.getCodeState = '秒后重新获取'
            isFirst = false;
          }

        }, 1000, 61);

        if (isFirst) {
          var url = GlobalVariable.SERVER_PATH + 'Info/sendcode/'
          var params = {
            phone:$scope.bindData.phone
          }
          postDataFty.postData(params, url).then(
            function(data){
              alert(angular.toJson(data))
            },function(error){

            })
          isFirst = false;
        }
      }
    };

    //修改安全码
    $scope.setbindData = function(){
      if(!$scope.bindData.buttonState){
        $scope.bindData.buttonWaite = true;
        $scope.bindData.changeBtnState = '提交中...'
        
        var url = GlobalVariable.SERVER_PATH+ 'Info/changepaypsd/';
        var parmas = {//参数
          id:userinfo.info.userid,
          paypassword:$scope.bindData.oldSafeNum,
          newpaypassword:$scope.bindData.safeNum,
          phone:$scope.bindData.phone,
          code:$scope.bindData.sms
        }
        // alert('参数为'+angular.toJson(parmas))
        postDataFty.postData(parmas,url).then(
          function(data){
            if(data.ok){
              Message.show('设置安全码成功，2秒后返回',1600);
              $scope.bindData.buttonState = true;
              $scope.bindData.buttonWaite = false;
              $scope.bindData.changeBtnState = '修改成功，2秒后返回';
              $timeout(function(){
                $ionicHistory.goBack();
              }, 2000)
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
        $ionicHistory.goBack();
        $ionicHistory.clearCache();
        $scope.bindData.buttonState= false;
      }
    };

    $scope.$on('$ionicView.beforeEnter', function(event, viewData){
      viewData.enableBack = true;
    })




  }]);
