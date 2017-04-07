angular.module('private.controller', ['ionic', 'ykg.services', 'global'])
  .controller('privateCtrl', ['$scope',
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
      var type = 1;
      var picArr = [];
      $scope.userInfo = getCurrentUserFty.getCurrentUser();
      // console.log(angular.toJson($scope.userInfo))

      //打开活动列表，得到base64码
      $scope.uploadAvatar = function (index) {
        var img1 = document.getElementById('front');
        var img2 = document.getElementById('back');

        uploadPicFty2.activeSheet(true).then(
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
        if(picArr.length >= 2) {
          $scope.userVer.buttonText = "上传中...";
          $scope.userVer.buttonWaite = true;
          var userInfo = getCurrentUserFty.getCurrentUser();
          // var imgurl = uploadPicFty2.activeSheet(0);
          // alert(imgurl.length)

          var params = {
            username: $scope.userVer.chinese,
            number:$scope.userVer.identite,
            uid: userInfo.id,
            rand: userInfo.rand,
            data: picArr[0],
            data2: picArr[1]
          };
          // alert(angular.toJson(params))

          var url = GlobalVariable.SERVER_PATH + 'Home/Index/uploadidcard/';
          $.ajax({
            url: url,
            method: 'POST',
            data: params,
            dataType: 'json',
            success: function (data) {
              if (data.ok == 1) {
                $scope.userVer.buttonWaite = false;
                $scope.userVer.buttonText = "成功，返回认证其他页";
                $scope.userVer.buttonState = false;
                Message.show('身份证号码验证成功');
                $timeout(function() {
                  $ionicHistory.goBack();
                }, 1000);
              }

              switch (data.error) {
                case 0:
                  Message.show('你的帐号已在其他地方登录了，请重新登录');
                  $scope.userVer.buttonText = "提交";
                  $scope.userVer.buttonWaite = false;
                  break;

                case 2:
                  Message.show('身份证号姓名不一致');
                  $scope.userVer.buttonText = "提交";
                  $scope.userVer.buttonWaite = false;
                  break;

                case 4:
                  Message.show('无此身份证号或姓名');
                  $scope.userVer.buttonText = "提交";
                  $scope.userVer.buttonWaite = false;
                  break;

                case 5:
                  Message.show('此身份证已经被认证过了，请不要重复认证');
                  $scope.userVer.buttonText = "提交";
                  $scope.userVer.buttonWaite = false;
                  break;
              }

            }, error: function (error) {
              // alert(state);
              // alert('error'+JSON.stringify(error));
              // alert('error'+angular.toJson(error))
              $scope.userVer.buttonText = "提交";
              $scope.userVer.buttonWaite = false;
              Message.show('身份证号码验证失败' + angular.toJson(error), 5000);
            }
          });
        }else{
          Message.show('你没有选择要上传的图片，或不完整',1600);
        }

      };//save

      // 用户认证信息验证
      $scope.userVer = {
        identite: null,
        chinese: null,
        identiteCardFront: null,
        identiteCardBack: null,
        buttonText: '提交',
        buttonWaite: false,
        buttonState: true,
        filled:$scope.userInfo.truename != null && $scope.userInfo.idnumber != null && $scope.userInfo.idcard != ''
      }

      // alert($scope.userVer.filled);
      //身份证号码验证
      $scope.identite = function () {
        $scope.identiteErr = verificationFty.identite($scope.userVer.identite);
      }

      //中文名验证
      $scope.chinese = function () {
        $scope.chineseErr = verificationFty.chinese($scope.userVer.chinese)
      }

    }]);
