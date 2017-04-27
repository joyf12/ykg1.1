angular.module('withdraw.controller', ['ykg.services', 'global'])
  .controller('withdrawCtrl', ['$scope',
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
    'Storage',
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
              Storage,
              postDataFty){
      var userInfo = getCurrentUserFty.getCurrentUser();
      $scope.account = Storage.get('account');
      //如果没有实名认证及填写收款信息，就跳到认证页

      //返回按钮
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = true;
      });

      //显示出身份选择菜单
      $scope.typeMenu = {
        active: false,
        displayType: '商家',
        buttonWaite:false,
        buttonState:false,
        buttonText:'确认提现'
      };

      $scope.userMoney = {}//用户可提现金

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

      $scope.showTab = true;

      //获取用户补助
      $scope.getUserType = function (type) {
        $scope.typeMenu.active = false;

        $scope.typeMenu.displayType = type;
        switch (type) {
          case '商家':
            $scope.userMoney.sum = $scope.account.info.backmoney == null ? $scope.account.info.backmoney = 0 : $scope.account.info.backmoney;
            break;

          case '代理商':
            $scope.userMoney.sum = $scope.account.info.dailijiangli;
            break;
        }
      };

      $scope.$on('$ionicView.afterEnter',function(){
        $scope.getUserType('商家');
        getMoney();
      });

    
      $scope.typeToggle = function () {
        $scope.typeMenu.active = !$scope.typeMenu.active;
        // console.log($scope.typeMenu.active)
      }

      //提交数据初始化
      $scope.userMoney = {
        sum: 0,//可提现金额初始化
        cash: 0,//提现金额初始化
        code:null//提现密码初始化
      };

     
      //提现申请
      $scope.Apply = function () {
        if($scope.typeMenu.buttonState == false){
          $scope.typeMenu.buttonWaite = true;
          $scope.typeMenu.buttonText = '申请提交中...'
          var userinfo = getCurrentUserFty.getCurrentUser();
          var url = GlobalVariable.SERVER_PATH + 'index/withdraw';
          var type = '';
          switch ($scope.typeMenu.displayType) {
            case '商家':
              type = 'backmoney';
              break;

            case '代理商':
              type = 'dailijiangli';
              break;

          }

          var parmas = {
            id: userinfo.info.userid,
            type: type,//取现类型
            cash: $scope.userMoney.cash, //提现金额
            code: $scope.userMoney.code
          };
          // alert(angular.toJson(parmas))
          $scope.$on('$destroy',function(e){
            $timeout.cancel(timer);
          })
          
          var timer = null;
          postDataFty.postData(parmas, url).then(
            function (data) {
              // alert(angular.toJson(data))
              $scope.data = data;
              if (data.ok) {
                $scope.typeMenu.buttonState = true;
                $scope.typeMenu.buttonWaite = false;
                $scope.typeMenu.buttonText = '提交成功';
                Message.show('你的申请已经提交,2秒后返回')
                timer = $timeout(function(){
                  $ionicHistory.goBack();
                },2000)
              } else if(data.error){
                if(data.error == '支付密码不正确'){
                  // Message.show('安全码错误，请重新输入',1600);
                  $scope.typeMenu.buttonState = false;
                  $scope.typeMenu.buttonWaite = false;
                  $scope.typeMenu.buttonText = '确认提现';
                  popupFty.confirmPopup(
                    '安全码错误',
                    '安全码错误或没有设置安全码，如果你确定设置过安全码，点取消后重新输入，如果没有或忘记了，请点去设置',
                    '去设置',
                    function(){
                      $location.path('/setWithdrawPS');
                    },
                    function(){
                      $ionicHistory.goBack();
                    })

                }else{
                  Message.show(data.error,1600);
                  $scope.typeMenu.buttonState = false;
                  $scope.typeMenu.buttonWaite = false;
                  $scope.typeMenu.buttonText = '确认提现';
                }
               
              }
            }, function (error) {
                Message.show('哎呀！网络好像出错了');
                $scope.typeMenu.buttonState = false;
                $scope.typeMenu.buttonWaite = false;
                $scope.typeMenu.buttonText = '确认提现';
            })
          
        }else{
          $ionicHistory.goBack();
          $scope.typeMenu.buttonState = false;
          $scope.typeMenu.buttonWaite = false;
          $scope.typeMenu.buttonText = '确认提现';
        }
        getMoney();
      };

      //实名认证信息
      function getMoney(){
        var parmas = {
          uid: userInfo.id,
          rand: userInfo.rand
        }
        var url = GlobalVariable.SERVER_PATH + 'Home/Index/';
        getDataFty.getData(parmas, url).then(
          function (data) {
            // alert(angular.toJson(data))
            // if (true) {
            for (var key in data.ok) {
              if (data.ok[key].bank != '' && data.ok[key].bankcardnumber != null && data.ok[key].truename != null) {
                if (data.ok.hasOwnProperty(key)) {
                  // sessionFty.set(data.ok[key]);//把实名信息存进去
                  $scope.data = data.ok[key];
                }
              } else {
                popupFty.confirmPopup(
                  '完善信息',
                  '你还没有进行实名认证或个人信息不全，请完善后再试',
                  '去完善',
                  function callback() {
                    $state.go('finishYourInfo');
                  },
                  function cancelback() {
                    $ionicHistory.goBack();
                  })
              }
            }
          }, function (error) {
            // error callback
          });
      };


    }]);
