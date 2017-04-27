
angular.module('realname.controller', ['ionic', 'ykg.services', 'global'])
.controller('realnameCtrl', [
    '$scope',
    '$state',
    'popupFty',
    '$timeout',
    '$window',
    'uploadPicFty',
    'Storage',
    'verificationFty',
    'getCurrentUserFty',
    'GlobalVariable',
    'Message',
    '$ionicHistory',
    
    function ($scope,
      $state,
      popupFty,
      $timeout,
      $window,
      uploadPicFty,
      Storage,
      verificationFty,
      getCurrentUserFty,
      GlobalVariable,
      Message,
      $ionicHistory) {
      $scope.$on('$ionicView.beforeEnter',function(event,viewDate){
         viewDate.enableBack=true;
     })

      var type = 1;
      var picArr = [];

      $scope.userInfo = getCurrentUserFty.getCurrentUser();
      $scope.account = Storage.get('account');

      // var account = Storage.get('account');
      // var userRealname = Storage.get('account');//用户帐户信息
      //打开活动列表，得到base64码
      $scope.uploadAvatar = function (index) {
         	var img1 = document.getElementById('front');
         	var img2 = document.getElementById('back');

         	uploadPicFty.activeSheet(true).then(
         		function(data){
         			if(index == 1){
         				picArr[0] = data;
         			}else{
         				picArr[1] = data;
         			}
         			img1.src=picArr[0]
         			img2.src=picArr[1]
         		},function(error){

         		}); 
      };

       // 上传用户文件
      $scope.saveAvatar = function () {
          if($scope.userVer.buttonState){
            if(picArr.length >= 2) {
               $scope.userVer.buttonText = "上传中...";
               $scope.userVer.buttonWaite = true;
               var userInfo = getCurrentUserFty.getCurrentUser();
               var params = {
                id: userInfo.id,
                username: $scope.userVer.chinese,
                number:$scope.userVer.identite,
                rand: userInfo.rand,
                idcardpic: picArr[0],
                unidcardpic: picArr[1]
            };

            var url = GlobalVariable.SERVER_PATH + 'info/uploadidcard/';
            $.ajax({
                url: url,
                method: 'POST',
                data: params,
                dataType: 'json',
                success: function (data) {
                   if (data.ok) {
                      $scope.userVer.buttonWaite = false;
                      $scope.userVer.buttonText = "成功，2秒后返回";
                      $scope.userVer.buttonState = false;
                      Message.show('身份证号码验证成功',1600, function(){
                        $timeout(function(){
                          $ionicHistory.goBack();  
                        },2000)
                    });

                  }else if(data.error){
                      Message.show(data.error,1600);
                      $scope.userVer.buttonWaite = false;
                      $scope.userVer.buttonText = "提交";
                      $scope.userVer.buttonState = true;
                  }

              }, error: function (error) {
                   $scope.userVer.buttonText = "提交";
                   $scope.userVer.buttonWaite = false;
                   $scope.userVer.buttonState = true;
                   Message.show('网络出错了，重试一次或稍候再试', 1600);
          }
       });
        }else{
            Message.show('你没有选择要上传的图片，或不完整',1600);
        };
      }else{
        $ionicHistory.goBack();    
      }

      };
      //save

       // 用户认证信息验证
      $scope.userVer = {
       	identite: null,
       	chinese:null,
       	identiteCardFront: null,
       	identiteCardBack: null,
       	buttonText: '提交',
       	buttonWaite: false,
       	buttonState: true,
       	filled:$scope.account.info.truename != null &&  $scope.account.info.truename != '' &&  $scope.account.info.idnumber != null &&  $scope.account.info.idnumber != ''
      };

       //

       // alert($scope.userVer.filled);
       //身份证号码验证
      $scope.identite = function () {
       	$scope.identiteErr = verificationFty.identite($scope.userVer.identite);
      };

       //中文名验证
      $scope.chinese = function () {
       	$scope.chineseErr = verificationFty.chinese($scope.userVer.chinese)
      }

  }]);
