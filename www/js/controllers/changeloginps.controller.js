angular.module('changeloginps.controller', ['ykg.services', 'global'])
  .controller('changeloginpsCtrl',
    ['$scope',
      '$state',
      'verificationFty',
      'getHashFty',
      'postDataFty',
      'getCurrentUserFty',
      'getDataFty',
      '$timeout',
      'GlobalVariable',
      '$interval',
      '$ionicHistory',
      'Message',
      function
        ($scope,
         $state,
         verificationFty,
         getHashFty,
         postDataFty,
         getCurrentUserFty,
         getDataFty,
         $timeout,
         GlobalVariable,
         $interval,
         $ionicHistory,
         Message){
        $scope.bindData = {
          phone: null,//手机号
          code: null, //验证码
          oldPS: null,//旧密码
          newPS1: null,//新密码
          newPS2: null,//确认新密码
          buttonText: '确认更改',
          buttonState: false,
          CodeInterval: null,
          getCodeState: '获取验证码'
        }

        //保存修改的密码
        var timer = null;
        $scope.currentInfo = getCurrentUserFty.getCurrentUser();
        $scope.changeLoginPS = function () {
          if ($scope.bindData.buttonState) {
            $ionicHistory.goBack();
          } else {
            $scope.bindData.newPS1 //判断旧密码是否正确
            $scope.bindData.newPS2 //判断旧密码是否正确
            // var UserInfo F= getCurrentUserFty.getCurrentUser();//获取用户信息
            var params = {
              'id': $scope.currentInfo.id,
              'password':$scope.bindData.oldPS,
              'phone':$scope.bindData.phone,
              'newpassword': $scope.bindData.newPS1,
              'code':$scope.bindData.code   
            };

            // alert(angular.toJson(params))
            var url = GlobalVariable.SERVER_PATH + 'Info/changeloginpsd';
            postDataFty.postData(params, url).then(function (data) {
              // alert(angular.toJson(data))
              if (data.ok) {
                $scope.bindData.buttonText = '修改成功，2秒后返回';
                $scope.bindData.buttonState = true;
                $scope.bindData.oldPS = null;
                $scope.bindData.newPS2 = null;
                $scope.bindData.newPS2 = null;
                $timeout(function(){
                 timer = $ionicHistory.goBack();
                },2000)
              }else{
                Message.show(data.error,1600);
                 $scope.bindData.buttonText = '确认更改';
                 $scope.bindData.buttonState = false;

              }
            }, function (error) {
              $scope.bindData.buttonState = false;
              $scope.bindData.buttonText = '确认更改';
              Message.show('哎呀！好像失败了')
            })
          }
        }

        $scope.$on('$destory',function(){
          $timeout.cancel(timer);
        })

        //旧密码验证
        // $scope.verificationOldPS = function () {
        //   $scope.currentInfo = getCurrentUserFty.getCurrentUser();
        //   console.log($scope.currentInfo.password + ',' + $scope.bindData.oldPS)
        //   // console.log(currentInfo);
        //   if ($scope.currentInfo.password != $scope.bindData.oldPS) {
        //     $scope.oldPSErr = true;//旧密码输入错误
        //   } else {
        //     $scope.oldPSErr = false;//旧密码输入错误
        //   }
        // };

        //新密码规范验证
        $scope.verificationNewPS = function () {
          $scope.newPSErr1 = verificationFty.password($scope.bindData.newPS1)
        };

        //新密码是否一致
        $scope.onceAgain = function () {
          var currentInfo = getCurrentUserFty.getCurrentUser();
          if ($scope.bindData.newPS1 !== $scope.bindData.newPS2) {
            $scope.newPSErr2 = true; //新密码两次不一致
          } else {
            $scope.newPSErr2 = false; //新密码两次不一致
          }
        };

        
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
                $scope.bindData.getCodeState = '秒后重试获取'
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


      }]);
