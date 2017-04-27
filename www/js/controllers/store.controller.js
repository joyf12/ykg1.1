angular.module('store.controller', ['ionic','ykg.services'])
.controller('storeCtrl', [
	'toggleFty',
	'$scope',
	'$stateParams',
	'GlobalVariable',
	'postDataFty',
	'$timeout',
	'$cordovaLaunchNavigator',
	'sessionFty',
	function(
		toggleFty,
		$scope,
		$stateParams,
		GlobalVariable,
		postDataFty,
		$timeout,
		$cordovaLaunchNavigator,
		sessionFty
		){


	$scope.active = function(index){
		$scope.actions = -1;
		if(index){
			$scope.actions = toggleFty.actions(index);
		}
	};
	$scope.storeId = $stateParams.storeId;
	$scope.$on('$ionicView.afterEnter',function(){
		$scope.active();
	})

	$scope.options = {
	  loop: true,
	  effect: 'slide',
	  speed: 500,
	}

	var position = null;//商家坐标

	//调用第三方导航,还需要调试
      $scope.navigate = function () {
        var start = null, dest = null;//初始化起点和终点值
        var userCoordinate = sessionFty.get('coordinate');//拿到当前用户的坐标

        if(position.shoplat == null){//如果商家坐标为空
          if(userCoordinate != null || userCoordinate != ''){//如果用户坐标不为空
            start = userCoordinate.lat+','+userCoordinate.lng;
          }else{
            start = '22.988133,113.720552';//起始点
          }
  
          popupFty.confirmPopup(
            '一点意外',
            '商家的坐标为空，不能准确定位到商铺的位置，已将坐标重置为智点生活公司总部地址，若要导航，请手动输入商家地址，是否导航？',
            '导航',
            function(){
              dest = '22.988133,113.720552';//目标点
              $cordovaLaunchNavigator.navigate(dest, start).then(function() {
                console.log("Navigator launched");
              }, function (err) {
                console.error(err);
              });
            },function(){
            //导航导航
          })

      //如果商家坐标不为空   
    }else{
        
        //如果用户位置为空
        if(userCoordinate == null || userCoordinate == '' || userCoordinate == undefined){
        	start = '22.988133,113.720552';//起始点
        }else{
        	start = userCoordinate.lat + ',' + userCoordinate.lng
        } 
        position = position.shoplat +','+position.shoplng;        
        dest = position;//目标点

        $cordovaLaunchNavigator.navigate(dest, start).then(function() {
            console.log("Navigator launched");
          }, function (err) {
            console.error(err);
          });
          
        }

      //如果有商铺坐标
        $cordovaLaunchNavigator.navigate(dest, start).then(function() {
          console.log("Navigator launched");
        }, function (err) {
          console.error(err);
        });
        isFirst = false;    
    };

$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
    getShowcase();
})

function getShowcase(){
	var url = GlobalVariable.SERVER_PATH + 'shop/shopinfo/';
	var params = {
		id:$scope.storeId	
	}
    

	postDataFty.postData(params, url).then(function(data){
		// console.log(angular.toJson(data))
		// var res = data.ok;
		$scope.store = data.ok[0];
		position = data.ok;
		console.log(position);
		
	},function(error){
		$timeout(function(){
			getShowcase();
		},5000)
	})
}

}])