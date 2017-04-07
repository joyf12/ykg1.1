angular.module('shop.controller', ['ionic','ykg.services','global'])
.controller('shopCtrl', [
	'toggleFty',
	'$scope',
	'postDataFty',
	'Message',
	'GlobalVariable',
	function(
		toggleFty,
		$scope,
		postDataFty,
		Message,
		GlobalVariable
		){


	$scope.active = function(index){
		$scope.actions = -1;
		if(index){
			$scope.actions = toggleFty.actions(index);
		}
	};


	$scope.$on('$ionicView.afterEnter',function(){
		$scope.active();
	})

	$scope.options = {
	  loop: true,
	  effect: 'slide',
	  speed: 500,
	}

	//拿到分类
	function getcategory(){
		var url = GlobalVariable.SERVER_PATH + 'Index/classitem';
		var params = {
			
		}
		postDataFty.postData(null, url).then(function(data){
			if(data.ok){
				$scope.res = data.ok;
				// alert(angul÷Ωar.toJson(data))
			}else if(data.error){
				Message.show(data.error, 1600)
			}

		},function(error){
			console.log('没有拿到分类信息')
		})
	}

	$scope.$on('$ionicView.afterEnter',function(){
		getcategory();
	})




	
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