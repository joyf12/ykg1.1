angular.module('config', ['ionic'])
.config(function($ionicConfigProvider){
	$ionicConfigProvider.platform.android.tabs.position("buttom");
	$ionicConfigProvider.platform.ios.tabs.position('buttom');

	$ionicConfigProvider.platform.ios.tabs.style('standard');
	$ionicConfigProvider.platform.android.tabs.style('standard');

	$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
	$ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

	$ionicConfigProvider.platform.ios.views.transition('ios');
	$ionicConfigProvider.platform.android.views.transition('android');
})