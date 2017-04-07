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
              $location){
      var userInfo = getCurrentUserFty.getCurrentUser();
      //如果没有实名认证及填写收款信息，就跳到认证页
      // if (userInfo.register) {
      //   finishYourInfo();
      // }
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

      //
      $scope.showTab = true;

      //获取用户补助
      $scope.getUserType = function (type) {
        $scope.typeMenu.active = false;
        $scope.typeMenu.displayType = type;
        switch (type) {
          case '商家':
            $scope.userMoney.sum = userInfo.tuiguangjiangli;
            break;

          case '推广员':
            $scope.userMoney.sum = userInfo.zhaoshangjiangli;
            break;

          case '代理商':
            $scope.userMoney.sum = userInfo.fuwujiangli;
            break;

          default:
            $scope.userMoney.sum = userInfo.tuiguangjiangli;
        }
      };

      
      $scope.$on('$ionicView.afterEnter',function(){
        $scope.getUserType('推广员');
        getMoney();
      })


      //可回购积分提现
      function withdraw(type) {
        var url = '';
        var parmas = {
          uid: userInfo.id,
          rand: userInfo.rand,
          type: type //用户类型，推广员，招商员,代理商
        }
      }

      

      $scope.typeToggle = function () {
        $scope.typeMenu.active = !$scope.typeMenu.active;
        // console.log($scope.typeMenu.active)
      }

      //提交数据初始化
      $scope.userMoney = {
        sum: 0,//可提现金额初始化
        cash: 0,//提现金额初始化
        code:null//提现密码初始化
      }

      // 用户身份选择
      $scope.changeType = function (type) {
      }

      //提现申请
      $scope.withdrawApply = function () {
        if($scope.typeMenu.buttonState === false){
          $scope.typeMenu.buttonWaite = true;
          $scope.typeMenu.buttonText = '申请提交中...'
          var userinfo = getCurrentUserFty.getCurrentUser();
          var url = GlobalVariable.SERVER_PATH + 'Home/Index/apptx/';
          var type = '';
          switch ($scope.typeMenu.displayType) {
            case '推广员':
              type = 'tuiguangjiangli';
              break;

            case '招商员':
              type = 'zhaoshangjiangli';
              break;

            case '服务商':
              type = 'fuwujiangli';
              break;

            case '代理商':
              type = 'dailijiangli';
              break;

          }

          var parmas = {
            uid: userinfo.id,
            rand: userinfo.rand,
            type: type,//取现类型
            cash: $scope.userMoney.cash, //提现金额
            code: $scope.userMoney.code
          }
          // alert(angular.toJson(parmas))
          $scope.$on('$destroy',function(e){
            $timeout.cancel(timer);
          })
          
          var timer = null;
          getDataFty.getData(parmas, url).then(
            function (data) {
              // alert(angular.toJson(data))
              $scope.data = data;
              if (data.ok == 1) {
                $scope.typeMenu.buttonState = true;
                $scope.typeMenu.buttonWaite = false;
                $scope.typeMenu.buttonText = '提交成功';
                Message.show('你的申请已经提交,1秒后返回')
                timer = $timeout(function(){
                  $ionicHistory.goBack();
                },1200)
              } else {
                if(data.error == 9){
                  // Message.show('安全码错误，请重新输入',1600);
                  $scope.typeMenu.buttonState = false;
                  $scope.typeMenu.buttonWaite = false;
                  $scope.typeMenu.buttonText = '确认提现';
                  popupFty.confirmPopup(
                    '安全码错误',
                    '安全码错误或没有设置安全码，如果你确定设置过安全码，点取消后重新输入，如果没有或忘记了，请点去设置',
                    '去设置',
                    function(){
                      $location.path('/changeWithdraw');
                    },
                    function(){
                      //cancelfn
                    })

                }else{
                  Message.show(data.error);
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
      }

      //实名认证信息
      function getMoney()  {
        var parmas = {
          uid: userInfo.id,
          rand: userInfo.rand
        }
        var url = GlobalVariable.SERVER_PATH + 'Home/Index/withdraw';
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
      }

      


    }]);
