angular.module('advance.controller', ['ykg.services', 'global'])
  .controller('advanceCtrl', ['$scope',
    '$state',
    '$timeout',
    'getCurrentUserFty',
    'getDataFty',
    '$ionicPopup',
    'GlobalVariable',
    'Message',
    'popupFty',
    '$ionicHistory',
    'sessionFty',
    '$location',
    'postDataFty',
    function ($scope,
              $state,
              $timeout,
              getCurrentUserFty,
              getDataFty,
              $ionicPopup,
              GlobalVariable,
              Message,
              popupFty,
              $ionicHistory,
              sessionFty,
              $location,
              postDataFty){

      var userInfo = getCurrentUserFty.getCurrentUser();
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
      });

      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        unfreeze();//可解冻金额
        getAccount();//可解冻金额
      });

      //显示出身份选择菜单
      $scope.typeMenu = {
        buttonWaite:false,
        buttonState:false,
        buttonText:'确认提现'
      };

      $scope.userMoney = {};
      //弹窗
      function finishYourInfo() {
        var confirmPopup = $ionicPopup.confirm({
          title: '未完善个人信息',
          template: '请先完善个人信息，才能提现',
          buttons: [{
            text: "取消",
            type: 'butotn-clear',
            onTap: function (e) {
              return 'cancel';
            }
          }, {
            text: '去完善',
            type: 'button-assertive',
            onTap: function (e) {
              return 'active';
            }
          }]
        });

        confirmPopup.then(function (res) {
          if (res == 'active') {
            $state.go('finishYourInfo');
          }
        })
      };

      //提交数据初始化
      $scope.userMoney = {
        sum: 0,//可提现金额初始化
        cash: 0,//提现金额初始化
        code:null//提现密码初始化
      }


      //获取用户帐户信息，姓名，银行卡号
      var userinfo = getCurrentUserFty.getCurrentUser();
      function getAccount(){
         var url = GlobalVariable.SERVER_PATH + 'info/info/';
         var params = {id:userinfo.id};
         postDataFty.postData(params, url).then(
          function(data){
            alert(angular.toJson(data))
            $scope.useraccount = data.ok
          },function(error){

          })
      };

      //可解冻金额
      function unfreeze(){
        var url = GlobalVariable.SERVER_PATH + 'index/maxtx/';
        var params = {id:userinfo.id};
        postDataFty.postData(params, url).then(
         function(data){
           alert(angular.toJson(data))
           $scope.unfreeze = data.ok
         },function(error){

         })
      };

      $scope.$on('$destroy',function(e){
        $timeout.cancel(timer);
      })

       //提现申请
      $scope.withdrawApply = function () {
        if($scope.typeMenu.buttonState == false){
          $scope.typeMenu.buttonWaite = true;
          $scope.typeMenu.buttonText = '申请提交中...'
          var userinfo = getCurrentUserFty.getCurrentUser();
          var url = GlobalVariable.SERVER_PATH + 'Index/kstx/';
          var type = '';
          
          var parmas = {
            id: userinfo.id,
            cash: $scope.userMoney.cash, //提现金额
            code: $scope.userMoney.code
          }
          
          var timer = null;
          postDataFty.postData(parmas, url).then(
            function (data) {
              // alert(angular.toJson(data))
              $scope.data = data;
              if (data.ok) {
                $scope.typeMenu.buttonState = true;
                $scope.typeMenu.buttonWaite = false;
                $scope.typeMenu.buttonText = '提交成功,2秒后返回';
                Message.show('你的申请已经提交,2秒后返回')
                timer = $timeout(function(){
                  $ionicHistory.goBack();
                },2000)
              }else if(data.error) {
                  $scope.typeMenu.buttonState = false;
                  $scope.typeMenu.buttonWaite = false;
                  $scope.typeMenu.buttonText = '确认提现';
                  Message.show(data.error, 1600)
                  if(data.error == '安全码错误'){//如果为安全码错误
                    popupFty.confirmPopup(
                      '安全码错误',
                      '安全码错误或没有设置安全码，如果你确定设置过安全码，点取消后重新输入，如果没有或忘记了，请点去设置',
                      '去设置',
                      function(){
                        $location.path('/changeWithdraw');
                      },function(){
                        //cancelfn
                      })
                  }   
              }
            }, function (error) {//获取数据失败
                Message.show('哎呀！网络好像出错了');
                $scope.typeMenu.buttonState = false;
                $scope.typeMenu.buttonWaite = false;
                $scope.typeMenu.buttonText = '确认提现';
            })
          
        }else{//如果重复点击
          $ionicHistory.goBack();
          // $scope.typeMenu.buttonState = false;
          // $scope.typeMenu.buttonWaite = false;
          // $scope.typeMenu.buttonText = '确认提现';
        }
      }

    }]);
