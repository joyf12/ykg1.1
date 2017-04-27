// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('ykg', ['ionic','route','config','global','ykg.controllers','ykg.services','ngCordova'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
   
  //物理返回按钮控制&双击退出应用
     $ionicPlatform.registerBackButtonAction(function (e) {
       //判断处于哪个页面时双击退出
       if ($location.path() == '/guidePage') {
         ionic.Platform.exitApp();
       }else if ($location.path() == '/tab/home' || $location.path() == '/tab/shop' || $location.path() == '/tab/account' || $location.path() == '/login' || $location.path() == '/signUp') {
         if ($rootScope.backButtonPressedOnceToExit) {
           ionic.Platform.exitApp();
           window.localStorage.setItem('isloginout',true);//退出app时，把登出变为true;
         } else {
           $rootScope.backButtonPressedOnceToExit = true;
           $cordovaToast.showShortBottom('再按一次退出系统');
           setTimeout(function () {
             $rootScope.backButtonPressedOnceToExit = false;
           }, 2000);
         }
       }else if ($ionicHistory.backView()) {
         // alert($cordovaKeyboard.isVisible());
         if ($cordovaKeyboard.isVisible()) {//按了物理返回键，如果键盘为打开状态，就关闭
           $cordovaKeyboard.close();
         } else {
           $ionicHistory.goBack();//按了物理返回键，如果键盘为关闭状态，就返回上一级
         }
       }else {
         if ($rootScope.backButtonPressedOnceToExit) {
           ionic.Platform.exitApp();
         }else{
           $rootScope.backButtonPressedOnceToExit = true;
           $cordovaToast.showShortBottom('再按一次退出系统');
           setTimeout(function () {
             $rootScope.backButtonPressedOnceToExit = false;
           }, 2000);
         }
       }
       e.preventDefault();
       return false;
     }, 110);



   });
})

