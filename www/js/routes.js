
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
	'private.route',
	'newslist.route',
	'newscontent.route',
	'backbean.route',
	'popularize.route',
	'moresetting.route',
	'mybasket.route',
	'pay.route',
	'guidepage.route',
    'storeaccount.route',
    'storeorder.route',
    'transfer.route',
    'uploadlog.route',
    'wechat.route',
    'safesetting.route',
    'changeloginps.route',
    'changeWithdraw.route',
    'setWithdrawPS.route',
    'goodsManager.route',
    'applyShop.route',
    'record.route',
	])
.config(function($stateProvider, $urlRouterProvider) {
  
   //如果不是第一次登陆，直接跳转
    if(localStorage["isFirst"]){
      if(localStorage.userinfo){
        $urlRouterProvider.otherwise('/tab/home');
      }else{
        $urlRouterProvider.otherwise('/login');
      }
      
    }
    else{
      $urlRouterProvider.otherwise('/guidepage');
    }
});
