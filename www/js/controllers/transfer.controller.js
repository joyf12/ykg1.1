
angular.module('transfer.controller', ['ionic','ykg.services'])
  .controller('transferCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$window',
    '$timeout',
    'cacheFty',
    function (
      $rootScope,
      $scope,
      $state,
      $window, 
      $timeout, 
      cacheFty
    ) {
        // 买家付款前确认
     $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
       viewData.enableBack = true;
     });
    

    $scope.payCode = function() {
       var transferPopup = $ionicPopup.transfer({
         title: '请输入用户安全码',
         templateUrl:'areas/transferVoucherPopup/inputtransferNum.html',
         // cssClass:'',
         buttons:[{
          text:'取消',
          type:'button-light'
         },{
          text:'确认交易',
          type:'button-assertive',
          onTap: function(e) {
             $scope.openModal();
             e.preventDefault();
             // return scope.data.response;
          }
         }
         ]
       });

       transferPopup.then(function(res) {
         if(res) {
           console.log('You are sure');
         } else {
           console.log('You are not sure');
         }
       });
     };

     $scope.checked = {
      payType:'bank'

     }

      $scope.payType = {
        bankPay:false,
        aliPay:false,
        wechatPay:false
      }

     $scope.change = function(){
      // $rootScope.userSelected = $scope.checked.payType;
       switch($scope.checked.payType){
       case 'bank':
       $scope.payType.bankPay = true;
       $scope.payType.alipay = false;
       $scope.payType.wechatPay = false;
       break;

       case 'alipay':
       $scope.payType.aliPay = true;
      $scope.payType.bankPay = false;
       $scope.payType.wechatPay = false;
       break;

       case 'wechat':
       $scope.payType.wechatPay = true;
       $scope.payType.bankPay = false;
       $scope.payType.aliPay = false;
       break;
      }
     }

      var orderNo = [];
      $scope.orderNo = [];
     //接收商家让利的订单号
      $scope.$on('$ionicView.afterEnter', function(){
        $scope.change();
        orderNo = cacheFty.getCache('orderno');
        $scope.sum = orderNo[orderNo.length-1];//拿到用户的订单总额
        // for(var i = 0; i < orderNo.length - 1; i++){
        //   $scope.orderNo.push(orderNo[i]);
        // }
        $scope.orderNo = orderNo.slice(0,orderNo.length-1)
        $scope.orderNo = $scope.orderNo.join(','); 
      })
      $scope.oDate = new Date();



     

   }]);

