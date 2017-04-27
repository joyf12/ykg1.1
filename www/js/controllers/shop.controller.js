angular.module('shop.controller', ['ionic','ykg.services','global'])
.controller('shopCtrl', [
	'toggleFty',
	'$scope',
	'postDataFty',
	'getDataFty',
	'Message',
	'GlobalVariable',
	'locationFty',
	'sessionFty',
	'Storage',
	'sessionFty',
	'getCurrentUserFty',
	function(
		toggleFty,
		$scope,
		postDataFty,
		getDataFty,
		Message,
		GlobalVariable,
		locationFty,
		sessionFty,
		Storage,
		sessionFty,
		getCurrentUserFty){
	$scope.active = function(index){
		$scope.actions = -1;
		if(index){
			$scope.actions = toggleFty.actions(index);
		}
	};

	// 初始化头部滚动条swiper
      function initHeaderSlide() {
        var headerSwiper = new Swiper('#headerSlider', {
	         slidesPerView: 1,//设置能同时显示的slide的数量
	         paginationClickable: true,//点击分页点控制swiper切换
	         centeredSlides: true,//设置活动块居中
	         autoplay: 1000,//自动切换的时间间隔
	         autoplayDisableOnInteraction: false,
	         loopAdditionalSlides : 1,
	         loop: true,
	         // 如果需要分页器
	         pagination: '.swiper-pagination',
	         // 改变自动更新
	         observer: true,
	         observeParents: true
          
        });
      }

	$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
	  // grab an instance of the slider
	  $scope.slider = data.slider;
	});

	function dataChangeHandler(){
	  // call this function when data changes, such as an HTTP request, etc
	  if ( $scope.slider ){
	    $scope.slider.updateLoop();
	  }
	}


	$scope.$on('$ionicView.afterEnter',function(){
		$scope.active();
		shopslide();
		initHeaderSlide();
		locationFty.location();

	});
	// 

	$scope.$on('$ionicView.loaded',function(){
		// initHeaderSlide();
	});

	


	//拿到分类
	function getcategory(){
		var url = GlobalVariable.SERVER_PATH + 'Index/classitem';
		var params = {	
		}
		postDataFty.postData(null, url).then(function(data){
			if(data.ok){
				$scope.res = data.ok;
				// alert(angular.toJson(data))
			}else if(data.error){
				Message.show(data.error, 1600)
			}

		},function(error){
			console.log('没有拿到分类信息')
		})
	};

	//shop轮播
	function shopslide(){
		var url = GlobalVariable.SERVER_PATH + 'shop/shoprotation/';
		var params = {	
		}
		postDataFty.postData(null, url).then(function(data){
			if(data.ok){
				$scope.slide = data.ok;
				// alert(angular.toJson(data))
			}else if(data.error){
				Message.show(data.error, 1600)
			}

		},function(error){
			console.log('没有拿到分类信息')
		})
	}


	$scope.$on('$ionicView.afterEnter',function(){
		
		getcategory();
		getstore();
	})

	// 附近商家

	function getstore(){
		var userInfo = getCurrentUserFty.getCurrentUser();


		var url = GlobalVariable.SERVER_PATH + 'shop/nearshop';
		var params = {
			id:userInfo.id,
			// lat:22.988145,
			// lng:113.720814
		}
		var position = null;

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

		postDataFty.postData(params, url).then(function(data){

			$scope.nearstore = data.ok;
			console.log(angular.toJson($scope.nearstore))
		},function(error){

		})
	}
	
}])

// 对商家分类按10个每份拆分
.filter('searchFit',function(){
	return function (data,num,start){
		data = data || [null]
		var result = [];
		data = data.slice(num,start);
		for(var i=0;i<start; i++){
			result.push(data[i]);
		}
		return data;
	}
})