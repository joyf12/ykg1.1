angular.module('home.controller', ['ionic','ykg.services'])
.controller('homeCtrl', [
	'toggleFty',
	'$scope',
	'sessionFty',
	'$ionicActionSheet',
	'$timeout',
	'$ionicSideMenuDelegate',
	'getDataFty',
	'GlobalVariable',
	'$location',
	function(
		toggleFty,
		$scope,
		sessionFty,
		$ionicActionSheet,
		$timeout,
		$ionicSideMenuDelegate,
		getDataFty,
		GlobalVariable,
		$location
		){

	
	$scope.$on('$ionicView.afterEnter',function(event, data){
      	
	})

	$scope.options = {
	  loop: true,
	  effect: 'slide',
	  speed: 500,
	}

	// 保存用户点击的按钮;
    $scope.toggle = function (params) {
      	
        if (params) {
          sessionFty.set('mark', params);
          // $scope.toggleLeft(false);
          actionsheet(params)
          $scope.current = toggleFty.actions(params);

        }else{
        	$scope.current = sessionFty.get('mark') ? sessionFty.get('mark') : 1;
        }
    };

    $scope.toggle();
    var hideSheet = null;

     //活动菜单
    function actionsheet(params) {
	   // Show the action sheet
	   //个人版
	   var list = [];
	   if(params == 1){
		   	list = [
			   	{ text: '我的订单' },
			    { text: '我的收益' },
			    { text: '我的记录' },
			   	{ text: '我要推广' },
			    { text: '公司动态' }
		    ]
		}else{
			list = [
			   	{ text: '今日订单' },
			    { text: '店铺资料' },
			    { text: '商品管理' },
			   	{ text: '我的评论' },
			    { text: '营业总额' },
			    { text: '客户管理' },
			    { text: '我的账单' },
			    { text: '广告推广' },
			    { text: '扫码收款' }
		    ]
		}


	   hideSheet = $ionicActionSheet.show({
	     
	   	buttons: list,
	     // destructiveText: 'Delete',
	     titleText: '更多信息',
	     cancelText: '取消',
	     cancel: function() {
	          // add cancel code..
	        },
	     buttonClicked: function(index) {
	     	// alert(index);
	     	if(params == 1){
	     		switch(index){
	     			case 0:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 1:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 2:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 3:
	     			$location.path('/commendqr');
	     			hideSheet();
	     			break;
	     			case 4:
	     			$location.path('/');
	     			hideSheet();
	     			break;	
	     		}

	     	}else if(params == 2){
	     		switch(index){
	     			case 0:
	     			$location.path('/');
	     			hideSheet();
	     			break;case 0:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 1:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 2:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 3:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 4:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 5:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 6:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 7:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     			case 8:
	     			$location.path('/');
	     			hideSheet();
	     			break;
	     		}
	     	}
	       
	     }
	   });

	   // For example's sake, hide the sheet after two seconds
	   // $timeout(function() {
	   //   hideSheet();
	   // }, 2000000);

	 };

	 $scope.toggleLeft = function() {
	    $ionicSideMenuDelegate.toggleLeft();
	};


  	//记住商家和消费者的选中状态
  	if (!sessionFty.get('mark')) {
    // popupMessage();
    sessionFty.set('mark', 1);
  	}

  	//首页轮播
  	getPoster();
  	getNews ();
  	getGoodsList();

	function getPoster (){

	  	var url = GlobalVariable.SERVER_PATH + 'Index/index';
	  	getDataFty.getData(null, url).then(function(data){
	  		if(data.ok){
	  			$scope.res = data.ok;
	  			// alert(angular.toJson(data.ok))
	  		}
	  	},function(error){

	  	})
	  }

	//新闻
	function getNews () {
		var url = GlobalVariable.SERVER_PATH + 'Index/news';
	  	getDataFty.getData(null, url).then(function(data){
	  		if(data.ok){
	  			$scope.news = data.ok;
	  			// alert(angular.toJson(data)
	  		}
	  	},function(error){

	  	})
	};

	//首页商品
	function getGoodsList () {
		var url = GlobalVariable.SERVER_PATH + 'Index/shop';
	  	getDataFty.getData(null, url).then(function(data){
	  		if(data.ok){
	  			$scope.goodsList = data.ok;
	  			// alert(angular.toJson(data))
	  		}
	  	},function(error){

	  	})
	};



   
	
}])