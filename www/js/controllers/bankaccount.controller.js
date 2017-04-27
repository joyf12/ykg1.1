angular.module('bankaccount.controller', ['ykg.services', 'global'])
.controller('bankaccountCtrl', ['$scope',
 'postDataFty', 
 'getCurrentUserFty', 
 'GlobalVariable', 
 'Message', 
 'uploadPicFty',
 '$ionicHistory',
 '$timeout',
 'Storage',
 function ($scope, 
  postDataFty,
  getCurrentUserFty, 
  GlobalVariable, 
  Message, 
  uploadPicFty,
  $ionicHistory,
  $timeout,
  Storage) {

  $scope.bankInfo = {
    // name: null,
    whichBank: null,
    whereApply: null,
    cardNumber: null,
    repeatCardNumber: null,
    bankusername:null

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
      $scope.account = Storage.get('account');
      // alert(angular.toJson($scope.account))
      $scope.activeState = {
        buttonState: false,
        buttonText: '提交',
        buttonWaite: false,
        filled:$scope.account.info.bankcardid != '' && $scope.account.info.bankcardid != 'null' && $scope.account.info.bankusername != null && $scope.account.info.bankusername != ''
      }

      //提交方法
      $scope.submit = function () {
        if (!$scope.activeState.buttonState) {//如果提交成功，不能重复提交
          if(picArr.length >= 1){
          $scope.activeState.buttonText = '上传中...';
          $scope.activeState.buttonWaite = true;
          var url = GlobalVariable.SERVER_PATH + "info/uploadbank/";
          var parmas = {//参数
            id: $scope.userInfo.userid,
            bankdeposit: $scope.bankInfo.whichBank,
            bankusername: $scope.bankInfo.bankusername,
            bankaccount: $scope.bankInfo.whereApply,
            bankcardnumber: $scope.bankInfo.cardNumber,
            bankcardnumber1: $scope.bankInfo.repeatCardNumber,
            bankcardpic: picArr[picArr.length - 1]
          }
          // alert(angular.toJson(parmas))
        
        postDataFty.postData(parmas, url).then(
          function (data) {
            // alert(angular.toJson(data))
            if(data.ok){
               Message.show('上传成功,2秒后返回', 1600,function(){
                $timeout(function(){
                  $ionicHistory.goBack();
                },2000)
               })
              $scope.activeState.buttonText = '提交成功';
              $scope.activeState.buttonWaite = false;
              $scope.activeState.buttonState = true;
              $timeout(function() {
                $ionicHistory.goBack();
              }, 800);
              // alert('success'+angular.toJson(data));
            }else if(data.error){
              Message.show(data.error, 1600);
              $scope.activeState.buttonText = '提交';
              $scope.activeState.buttonWaite = false;
              $scope.activeState.buttonState = false;
            }
           
            }, function (error) {
              Message.show('上传失败了，重试一次吧');
              $scope.activeState.buttonWaite = false;
              $scope.activeState.buttonState = false;
              $scope.activeState.buttonText = '提交';
              
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
        var promise = uploadPicFty.activeSheet(true);
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

      //返回按钮
      $scope.$on('$ionicView.beforeEnter', function(event, viewData){
        viewData.enableBack = true;
      })



    }]);

