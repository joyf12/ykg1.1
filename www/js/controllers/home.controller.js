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
	'$cordovaAppVersion',
	'$cordovaInAppBrowser',
	'popupFty',
	'$cordovaBarcodeScanner',
  'postDataFty',
  'locationFty',
  'Storage',
  'getCurrentUserFty',
	function(
		toggleFty,
		$scope,
		sessionFty,
		$ionicActionSheet,
		$timeout,
		$ionicSideMenuDelegate,
		getDataFty,
		GlobalVariable,
		$location,
		$cordovaAppVersion,
		$cordovaInAppBrowser,
		popupFty,
		$cordovaBarcodeScanner,
        postDataFty,
        locationFty,
        Storage,
        getCurrentUserFty
		){
		$scope.$on('$ionicView.afterEnter',function(){ 	
		})

	$scope.options = {
          loop: true,
          effect: 'fade',
          speed: 600,
          autoplay:true
          // duration:2000
          // slideinterval:2000
    }

	// 保存用户点击的按钮;
	$scope.toggle = function (params) {
		if (params) {
			sessionFty.set('mark', params);
          // $scope.toggleLeft(false);
          isshop(params)
          $scope.current = toggleFty.actions(params);

      }else{
      	$scope.current = sessionFty.get('mark') ? sessionFty.get('mark') : 1;
      }
  };

  var userInfo = getCurrentUserFty.getCurrentUser();
  // alert(angular.toJson(userInfo.info.isshop))

  $scope.toggle();
  var hideSheet = null;

     //活动菜单
    function isshop(params) {
	   // Show the action sheet
	   //个人版
       if(userInfo.info.isshop == 0 && params === 2){//如果不是商家
            popupFty.confirmPopup(
                '申请成为商家',
                '你还不是商家，点击申请填写资料，待审核审核通过后，即可成为商家',
                '申请',
                function(){$location.path('/applyShop')},
                function(){}
               );
       }else if(userInfo.info.isshop == 1 && params === 2){
            popupFty.AlertPopup(
                '审核中',
                '你的申请已经提交成功，由于申请人数较多，请等待2-5个工作日。',
                '知道了',
                function(){}
            );
       } else{//如果不是点商家版或者已经是商家
        actionsheet(params)
       }
	};

    function actionsheet(params){
        var list = [];
        if(params == 1){
            list = [
            { text: '我的订单' },
            { text: '我的收益' },
            { text: '我要推广' }
            ]
           }else{
            list = [
            { text: '上传凭证' },
            { text: '我的订单' },
            { text: '商品管理' },
            { text: '我的评论' },
            { text: '营业总额' },
            // { text: '我的账单' },
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
                        $location.path('/myorder');
                        hideSheet();
                        break;
                        
                        case 1:
                        $location.path('/backbean');
                        hideSheet();
                        break;

                        case 2:
                        $location.path('/commendqr');
                        hideSheet();
                        break;  
                    }

                }else if(params == 2){
                    switch(index){
                        case 0:
                        $location.path('/uploadlog');
                        hideSheet();
                        break;
                        
                        case 1:
                        $location.path('/storeorder');
                        hideSheet();
                        break;
                        case 2:
                        $location.path('/goodsManager');
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
                    }
      
                }

             }
        });
}

	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};


  	//记住商家和消费者的选中状态
  	if (!sessionFty.get('mark')) {
    // popupMessage();
    sessionFty.set('mark', 1);
}

  	//首页轮播
    $scope.$on('$ionicView.afterEnter', function(){
        getPoster();
        getNews ();
        getGoodsList();
        locationFty.location();
    })
  	

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
        var params = {}
        if(sessionFty.get('coordinate') != null){//如果高精度定位有效
         position = sessionFty.get('coordinate');
         params.lat = position.lat;
         params.lng = position.lng;
        }else if(!Storage.get('location').deft){//如果浏览器定位有效
         // alert(angular.toJson(Storage.get('location')))
         position = Storage.get('location').bounds.hb;
         params.lat = position.lat;
         params.lng = position.lng;

        }else{//默认定位
         position = Storage.get('location').bounds;
         params.lat = position.lat;
         params.lng = position.lng;
        }

        // alert(angular.toJson(params))

		var url = GlobalVariable.SERVER_PATH + 'Index/shop';
        
		postDataFty.postData(params, url).then(function(data){
			if(data.ok){
				$scope.goodsList = data.ok;
	  			// alert(angular.toJson(data))
	  		}else if(data.error){
                // alert(data.error)
            }
	  	},function(error){
            

	  	})
	};


	$scope.show = function() {
   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
   	buttons: [
   	{ text: '<b>Share</b> This' },
   	{ text: 'Move' }
   	],
   	destructiveText: 'Delete',
   	titleText: 'Modify your album',
   	cancelText: 'Cancel',
   	cancel: function() {
          // add cancel code..
      },
      buttonClicked: function(index) {
      	return true;
      }
  });

   // For example's sake, hide the sheet after two seconds
   $timeout(function() {
   	hideSheet();
   }, 2000);

};

 //检查更新
 $scope.checkUPdate = function() {
 	document.addEventListener("deviceready", function () {
 		var appVersion = null;
 		var versionInfo = {
 			title:'123',
 			number:2.0,
 			text:'4156464600',
 			url:'http://www.baidu.com',
 			button:'download'
 		}

 		$cordovaAppVersion.getVersionNumber().then(function (version) {
 			appVersion = version;
 			var url = GlobalVariable.SERVER_PATH + 'Admin/Pushtext/showtext';
 			if(appVersion < versionInfo.number){//如果有新版本
 				popupFty.AlertPopup(
 					versionInfo.title,
 					versionInfo.text,
 					versionInfo.button,
 					function () {
 						
 						var options = {
 							location: 'yes',
 							clearcache: 'yes',
 							toolbar: 'yes'
 						};


 						$cordovaInAppBrowser.open('http://www.baidu.com', '_system', options)
 						.then(function (event) {
	                   			// success
	                   		})
 						.catch(function (event) {
	                   			// error
	                   		});
 						
 						
 					})
 			}

 		});
 	}, false);
 };


 /*扫描二维码*/
 $scope.scan = function () {
 	document.addEventListener("deviceready", function (e) {
 		e.preventDefault();
 		$cordovaBarcodeScanner
 		.scan().then(function (barcodeData) {
 			if (true) {
	         // var rand = angular.fromJson(Storage.get('logined'));//取用户的随机数
	         var url = GlobalVariable.SERVER_PATH + 'Home/Index/showbook?bookid=' + barcodeData.text + '&rand=' + userInfo.rand + '&uid=' + userInfo.id;
	         Storage.set('url', url);//订单列表链接
	         $location.path('/orderConfirm');
	     }

	 }, function (error) {
	       // An error occurred
	       Message.show('扫码出错啦 ')
	   });
 	})
 };


}])