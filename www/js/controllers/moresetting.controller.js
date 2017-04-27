angular.module('moresetting.controller', ['ykg.services','global'])
.controller('moresettingCtrl', [
  '$rootScope',
  '$scope',
  'Storage',
  '$state',
  '$ionicPlatform',
  'Message',
  '$timeout',
  '$cordovaToast',
  '$cordovaAppVersion',
  'getCurrentUserFty',
  'popupFty',
  '$cordovaInAppBrowser',
  'getDataFty',
  'GlobalVariable',
  function (
    $rootScope,
    $scope,
    Storage,
    $state,
    $ionicPlatform,
    Message,
    $timeout,
    $cordovaToast,
    $cordovaAppVersion,
    getCurrentUserFty,
    popupFty,
    $cordovaInAppBrowser,
    getDataFty,
    GlobalVariable) {

    $scope.$on('$ionicView.beforeEnter', function (event, viewDate) {
      viewDate.enableBack = true;
    })

    $scope.$on('$ionicView.enter', function (e) {
    });

      //注销
      $scope.loginout = function () {
        Storage.remove('logined');
        $state.go('login');
      }



      //注销
      $scope.exit = function () {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          $cordovaToast.showShortBottom('再按一次退出系统');
          $timeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }

      }

      var userInfo = getCurrentUserFty.getCurrentUser();
      console.log(userInfo);
      if(userInfo){
        $scope.userPhone = userInfo.phone;
      }
      


      //获得app当前版本号
      document.addEventListener("deviceready", function () {
        $scope.appVersion = null;
        $cordovaAppVersion.getVersionNumber().then(function (version) {
          $scope.appVersion = version;
        });

      //检查更新
      
      $scope.uploadVersion = function () {
       

        // alert(userInfo.version+','+$scope.appVersion)
        userInfo.version = userInfo.version == undefined ? $scope.appVersion : userInfo.version;

        if(userInfo.version == $scope.appVersion) {
          Message.show('已经是最版本了')
        } else if(userInfo.version > $scope.appVersion) {
          popupFty.confirmPopup(
            '新版本下载',
            '有新版本下载，当前版本为' +  $scope.appVersion + '，新版本为' +userInfo.version,
            '下载',
            function () {
              //confirm callback
              // popupFty.AlertPopup(message.title, message.content, function () {
              var url = GlobalVariable.SERVER_PATH + 'Admin/Pushtext/showtext';
              var params = {
                show: 1
              }

              getDataFty.getData(params, url).then(function (data) {
                // alert(angular.toJson(data))
                if (data.url) {
                var options = {// 打开浏览器api的参数配置
                  location: 'yes',
                  clearcache: 'yes',
                  toolbar: 'yes'
                };

                //打开浏览器
                document.addEventListener("deviceready", function () {
                  $cordovaInAppBrowser.open(data.url, '_system', options)
                  .then(function (event) {
                      // success
                    })
                  .catch(function (event) {
                      // error
                    });
                });
              }
            }, function (error) {
              // alert();
            })
          },//callbackfn
          
          function () {
            //cancel callback
          })
        }
      }
    });


    }]);
