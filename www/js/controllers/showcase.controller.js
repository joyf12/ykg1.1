angular.module('showcase.controller', ['ionic','ykg.services'])
.controller('showcaseCtrl', [
	'toggleFty',
	'$scope',
	'$location',
	'$stateParams',
	'postDataFty',
	'getCurrentUserFty',
	'GlobalVariable',
	'cacheFty',
	'Message',
	'$timeout',
	'$q',
	function(
		toggleFty,
		$scope,
		$location,
		$stateParams,
		postDataFty,
		getCurrentUserFty,
		GlobalVariable,
		cacheFty,
		Message,
		$timeout,
		$q){


	$scope.active = function(index){
		$scope.actions = -1;
		if(index){
			$scope.actions = toggleFty.actions(index);
		}
	};

	var storeId = $stateParams.storeId;

	$scope.$on('$ionicView.afterEnter',function(){
		$scope.active();
	})

	$scope.options = {
	  loop: true,
	  effect: 'slide',
	  speed: 500,
	}

	// 
	var timer = null, timer2 = null;
	$scope.res = null;
	var goodsArr = [];

	function getShowcase(){
		var url = GlobalVariable.SERVER_PATH + 'shop/produce/';
		var params = {
			id:storeId
		}
		postDataFty.postData(params, url).then(function(data){
			$scope.res = data.ok;
			alert(angular.toJson(data))
		},function(error){
			ttimer = $timeout(function(){
				getShowcase();
			},5000)
		})
	};

	//用户选择要购买的商品
	$scope.index = {}, oldIndex = {};
	$scope.selectGoods = function(index,id){
		for(var i = 0; i < $scope.res.length; i++){
			if(index == i){
				if(oldIndex[i] == index){//取消选择
					$scope.index[i] = -1;
					oldIndex[i] = null;
					if(goodsArr.length == 1){
					goodsArr.splice(0,1);
					}else{
						goodsArr.splice(i,1);
					}
				}else{//选择
					oldIndex[i] = i;
					$scope.index[i] = i;
					goodsArr.push($scope.res[i]);
						
				}	
			}else{//非点击的项
				if(oldIndex[i] == i){//如果之前有选中的
					$scope.index[i] = i;
				}else{//其他全部变成非选中
					$scope.index[i] = -1;
				}
			}
			
		}
		console.log(goodsArr)
	}

	//把用户选择的商品放到购物车
	var goodsId = [], count = [];
	$scope.addcart = function(){
		var defered = $q.defer();
		if(goodsArr.length > 0){
			var userInfo = getCurrentUserFty.getCurrentUser();
			for(var j = 0; j < goodsArr.length; j++){
				goodsId.push(goodsArr[j].produceid);
				count.push(1);

			}
			var url  = GlobalVariable.SERVER_PATH + 'Shop/addshopcart';
			var params = {
			  id:userInfo.info.userid,
			  shopid:storeId,
			  produceid:goodsId,
			  count:count
			}
			// alert(angular.toJson(params.produceid))
			postDataFty.postData(params, url).then(function(data){
				if(data.ok){
					getGoods();	//获取购物车商品数
					goodsArr.length=0;
					defered.resolve();
				}
				
			},function(error){
				Message.show('加入购物车失败了，重试一次',1600);
				defered.reject();
			})
		}else{
			Message.show('没有选择商品',1600)
		}
		return defered.promise;	
	};

	//用户直接购买
	$scope.purchase = function(){
		if(goodsArr.length > 0){
			$scope.addcart().then(function(){
				$location.path('/mybasket');
			});
		}else{
			$location.path('/mybasket');
		}
	};

	$scope.$on('$ionicView.afterEnter', function(){
		getShowcase();
		getGoods();
	})

	//退出页面时清除定时器
	$scope.$on('$destory', function(){
		$timeout.cancel(timer);	
		$timeout.cancel(timer2);	
	})

	//获取购物车商品数
	// $scope.basketquatity = 0
	function getGoods(){
		$scope.basketquatity = 0
	    var url = GlobalVariable.SERVER_PATH + 'shop/shopcartbook';
	    var userInfo = getCurrentUserFty.getCurrentUser();
	    var params= {
	      id:userInfo.info.userid
    	}
	    postDataFty.postData(params, url).then(
	      function(data){
	        console.log(angular.toJson(data))
	        $scope.basketquatity = data.ok.length;
	        goodsArr.length = 0;
	    }, 
	    function(error){
	        timer2 = $timeout(function(){
	          getGoods();
	        },2000)
	    })
  	};

}])