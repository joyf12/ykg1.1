angular.module('bankaccount.controller', ['ykg.services', 'global'])
.controller('bankaccountCtrl', ['$scope',
 'postDataFty', 
 'getCurrentUserFty', 
 'GlobalVariable', 
 'Message', 
 'uploadPicFty',
 '$ionicHistory',
 '$timeout',
 function ($scope, 
  postDataFty,
  getCurrentUserFty, 
  GlobalVariable, 
  Message, 
  uploadPicFty,
  $ionicHistory,
  $timeout) {

  $scope.bankInfo = {
    // name: null,
    whichBank: null,
    whereApply: null,
    cardNumber: null,
    repeatCardNumber: null

  }

      $scope.inSame = false;//判断两次是否一致的初始值

      //判断卡号两次是否一致
      $scope.checkCardNumber = function () {
        if ($scope.bankInfo.repeatCardNumber != $scope.bankInfo.cardNumber) {
          $scope.inSame = true;
        } else {
          $scope.inSame = false;
        }
      }

       //状态改变变量
      $scope.userInfo = getCurrentUserFty.getCurrentUser();

      $scope.activeState = {
        buttonState: false,
        buttonText: '提交',
        buttonWaite: false,
        filled:$scope.userInfo.bankcardnumber != '' && $scope.userInfo.bankcardnumber != 'null' && $scope.userInfo.bankaccount != '' && $scope.userInfo.bankphoto != '' && $scope.userInfo.bankusername != ''
      }

      //提交方法
      $scope.submit = function () {
        if (!$scope.activeState.buttonState) {//如果提交成功，不能重复提交
          if(picArr.length >= 1){


          $scope.activeState.buttonText = '上传中...';
          $scope.activeState.buttonWaite = true;
          var url = GlobalVariable.SERVER_PATH + "Home/Index/uploadbank";
          var parmas = {//参数
            uid: $scope.userInfo.id,
            rand: $scope.userInfo.rand,
            // bankusername: $scope.bankInfo.name,
            bank: $scope.bankInfo.whichBank,
            bankaccount: $scope.bankInfo.whereApply,
            bankcardnumber: $scope.bankInfo.cardNumber,
            bankcardnumber1: $scope.bankInfo.repeatCardNumber,
            data1: picArr[picArr.length - 1]
          }
          // alert(angular.toJson(parmas))
        
        postDataFty2.postData(parmas, url).then(
          function (data) {
            // alert(angular.toJson(data))
            switch(data.error){
              case 1:
              Message.show('你的帐号已经其他设备上登录了');
              $scope.activeState.buttonWaite = false;
              $scope.activeState.buttonText = '提交';
              break;

              case 2:
              Message.show('输入不完整，请检查后再提交');
              $scope.activeState.buttonWaite = false;
              $scope.activeState.buttonText = '提交';
              break;

              case 3:
              Message.show('卡号两次不一致，请认真核对后再提交');
              $scope.activeState.buttonWaite = false;
              $scope.activeState.buttonText = '提交';
              break;
            };

            if(data.ok == 0){
               Message.show('上传成功')
              $scope.activeState.buttonText = '提交成功';
              $scope.activeState.buttonWaite = false;
              $scope.activeState.buttonState = true;
              $timeout(function() {
                $ionicHistory.goBack();
              }, 800);
              // alert('success'+angular.toJson(data));
            }
           
            }, function (error) {
              Message.show('上传失败了，重试一次吧');
              $scope.activeState.buttonWaite = false;
              $scope.activeState.buttonText = '提交';
              $scope.activeState.buttonState = false;
            })
        }else{
          Message.show('请上传银行卡照片') 
          }
        }else{
          $ionicHistory.goBack();
        }
      }

      //提交图片
      var oldPicArr = [];
      var picArr = [];
      //从本地拿到图片
      $scope.getPic = function () {
        var oldData = null;
        var promise = uploadPicFty2.activeSheet(true);
        promise.then(function (data) {
          if (data != null && oldPicArr != picArr) {
            picArr.push(data);
            if (oldPicArr.length != picArr.length) {
              $('.debitCard img').eq(0).attr('src', picArr[picArr.length - 1]);//把图片显示在视图上
            }
          }
          oldData = data;
        }, function (error) {//错误处理函数
          Message.show('哎呀，好像出错了，再试一次')
        })

        oldPicArr.length = picArr.length;
      }


    }]);
