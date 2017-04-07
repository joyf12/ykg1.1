
angular.module('route', [
	'tabs.route',
	'tabs.dash',
	'chatsDetail.route',
	'tab.account',
	'login.route',
	'signup.route',
	'forgetps.route',
	'tab.shop.route',
	'sidemenu.route',
	'commendqr.route',
	'store.route',
	'showcase.route',
	'uploadvoucher.route',
	'myorder.route',
	'withdraw.route',
	'advance.route',
	'realname.route',
	'alipay.route',
	'bankaccount.route',
	'private.route'
	])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
