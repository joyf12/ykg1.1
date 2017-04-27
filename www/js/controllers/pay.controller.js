angular.module('pay.controller', ['ykg.services', 'global'])
.controller('payCtrl', ['$scope',
 '$state',
 '$ionicHistory',
 'postDataFty',
 'getDataFty',
 'GlobalVariable',
 'Message',
 'Storage',
 '$location',
 'cacheFty',
 'getCurrentUserFty',
 
   function ($scope,
    $state,
    $ionicHistory,
    postDataFty,
    getDataFty,
    GlobalVariable,
    Message,
    Storage,
    $location,
    cacheFty,
    getCurrentUserFty
   ) {
	
	
	$scope.$on('$ionicView.beforeEnter', function(event, viewData){
		viewData.enableBack = true;
	});


	$scope.$on('$ionicView.afterEnter',function(){
	   getNews();
	})

    //商家账户信息
    $scope.data = null;
    $scope.accounttype =[];
    $scope.selected = null;
    $scope.bankaccount = [];

    //获取商家银行帐户信息
    $scope.account  = function(){
        var storeid = cacheFty.getCache('toPayList');
        // alert(angular.toJson(storeid[0].shopid))
        storeid = storeid[0].shopid;
        var url = GlobalVariable.SERVER_PATH + "shop/sure/";
        var params = {id:storeid};//商家ID
        var oData = Date.now();


        postDataFty.postData(params, url).then(
          function(data){
            if(data.ok){
                // alert(angular.toJson(data));
                cacheFty.setCache(oData, 'storeid', params.id);
                $scope.data = data.ok;
                alert(angular.toJson($scope.data))
                $scope.bankaccount = cacheFty.getCache('storeid');
                // alert(angular.toJson($scope.bankaccount))
                $scope.data = delete $scope.data[0].bankcardid;
                for(key in data.ok){
                    for(key2 in data.ok[key]){
                        if(data.ok[key][key2] != null && data.ok[key][key2] != ''){
                            $scope.accounttype.push(key2);
                        }
                    }
                }

                // alert(angular.toJson($scope.accounttype))

                for(var i = 0; i < $scope.accounttype.length; i++){
                    switch($scope.accounttype[i]){
                        case 'bankdeposit':
                        $scope.accounttype[i] = '银行卡';
                        break;

                        case 'alipay':
                        $scope.accounttype[i] = '支付宝';
                        break;

                        case 'weixinid':
                        $scope.accounttype[i] = '微信';
                        break;

                        case 'shopbean':
                        $scope.accounttype[i] = '购物豆';
                        break;

                         case 'down':
                        $scope.accounttype[i] = '线下';
                        break;
                    }
                };

                $scope.selected = $scope.accounttype[0]

                // $scope.selected = $scope.accounttype;
                // alert($scope.accounttype[0])
            }else if(data.error){
                Message.show(data.error,1600);
            }
            
          },function(error){
            alert(error)
          }) 
    };

    $scope.$on('$ionicView.afterEnter', function(){
        $scope.account();
    });

    var bank = false, selectpay = null;

    $scope.showselect = function(item){
        // alert(item)
        item = item == null ? '银行卡' : item;
        selectpay = item;
        // if(item){$scope.pay(item)}//取支付方式
        if(item == '银行卡'){
            return bank = true;
        }else{
            return bank = false;
        }
    };

   
    $scope.sum = 0;
    $scope.$on('$ionicView.afterEnter', function(){
        $scope.showselect();
        sum();    
    });

    //订单总价
    var goodsArr = cacheFty.getCache('toPayList');
   
    function sum (){
        var price = 0;
        if(goodsArr){//获取本地缓存成功
            // var goodsArr = cacheFty.getCache('toPayList');
            if(goodsArr.length == 0){
                $scope.sum = 0
                $scope.invalidSum = true;
            }else{
               for(var i = 0; i < goodsArr.length; i++){
                 price += parseFloat(goodsArr[i].price);
               } 
               $scope.sum = price
               $scope.invalidSum = false;
            }
            
        }else{//获取本地缓存失败了
            Message.show('获取订单金额失败了,重试一次', 1600);
            $scope.sum = 0;
            $scope.invalidSum = true;
        } 
    };

    $scope.invalidSum = true;
    $scope.pay = function(type) {//type 支付类型，submit 提交按钮
        var userInfo = getCurrentUserFty.getCurrentUser();//用户信息
            if(goodsArr.length > 0){//用户信息
                var url = GlobalVariable.SERVER_PATH + "shop/createindent/"
                var items = [], shopid = [], count = [], priceArr = [], price = 0;

                for(var i = 0; i < goodsArr.length; i++){
                  items.push(goodsArr[i].shopcartid);
                  shopid.push(goodsArr[0].shopid);
                  count.push(goodsArr[i].count);
                  priceArr.push(goodsArr[i].price);
                }

                for(var i = 0; i < priceArr.length; i++){
                  price += Number(priceArr[i]);
                }

                items = items.join(',');
                var params = {
                  id:userInfo.info.userid,
                  typepay:selectpay,//1线下 2支付宝 3微信 4购物豆
                  shopcarid:items,
                  price:price
                };

                // alert(angular.toJson(params))
                postDataFty.postData(params, url).then(
                  function(data){
                    // alert(angular.toJson(data))
                    if(data.ok){
                        if(type == '银行卡'){
                            $location.path('/storeaccount');
                        }else{
                            //console.log
                        }
                     
                    }else if(data.error){
                      Message.show(data.error, 1600)
                    }
                    
                  },function(error){//提交订单失败
                    Message.show('网络出现问题,提交订单失败了',1600)
                  })
                
            }else{//从缓存提取失败
                Message.show('订单丢失了，返回购物车重试一次', 1600);
            }
        }
}]);

