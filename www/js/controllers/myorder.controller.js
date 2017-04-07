angular.module('myorder.controller', ['ykg.services'])
.controller('myorderCtrl', [
'$rootScope',
 '$scope', 
 '$state',
 '$window',
 'getDataFty',
 'GlobalVariable',
 'Message',
 'Storage', 
	function (
	$rootScope,
	$scope,
	$state,
	$window,
	getDataFty,
	GlobalVariable,
	Message,
	Storage) {

		$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
			viewData.enableBack = true;
		}); 
  		$scope.page = 1;//ÆäÊµ·­Ò³
		$scope.myOrder = new Array();//ÎÒµÄ¶©µ¥
		var params=null;
		var url = GlobalVariable.SERVER_PATH+'Home/Index/mybooklist/';
		$scope.count = 0;//·­Ò³µÄ×ÜÊý
		
		$scope.nomore=true;
		//²éÑ¯ÉÌ¼Ò·½·¨
		$scope.getInfo = function(params){
			var promise = getDataFty.getData(params,url);
			promise.then(function(data){
				// alert(angular.toJson(data))
				// alert(angular.toJson(data))
				if(data.error=="1"){
					Message.show('帐号已经在其他地方登录了',500);
					setTimeout(function(){
						window.location.replace("/#/login");
					},1000);
				}else{
					if(data.count!=0){
						if($scope.myOrder.length==0){
							$scope.myOrder=data.list;
						}else{
							$scope.myOrder = $scope.myOrder.concat(data.list);//¸½½üÉÌ¼Ò
						}
						$scope.isload=false;
					}else{
						$scope.nomore=true;
					}
					$scope.count = data.count;
				}
			},function(){
				Message.show('»ñÈ¡ÐÅÏ¢Ê§°Ü',500);
				 //5ÃëºóÔÙ´ÎÇëÇóÒ»´Î
				 setTimeout(function(){
				 	$scope.getInfo(params);
				 },5000)
				})
		}
		if(Storage.get('logined')!=null&&(Storage.get('logined').id!=null&&Storage.get('logined').id!="")){
			params = {
				uid:Storage.get('logined').id,
				rand:Storage.get('logined').rand,
				page:$scope.page
			}
			$scope.getInfo(params);
		}
		$scope.$on('$ionicViewEnterAfter',function(){
		})
		
		//ÉÏÀ­¼ÓÔØ
		$scope.isload= false;//¿ØÖÆ¼ÓÔØÆ÷¶¯»­ Ò³ÃæÉÏÓÐÒ»¸öng-if
		$scope.loadMore = function() {
			if(!$scope.isload){
				if($scope.count>$scope.myOrder.length){
					params['page'] = ($scope.page+1);
					$scope.getInfo(params);
					$scope.isload=true;
				}else{
					$scope.nomore=true;
					$scope.isload=true;
					setTimeout(function(){
						$scope.isload=false;
					},1000)
					
				}
			}
		};

		$scope.$on('$stateChangeSuccess', function() {
			$scope.loadMore();
		});


		//页面退出时销毁
		$scope.$on('$destroy',function(){            
		console.log('$destroy');           
		  $rootScope.hideTabs = ' ';

		}) 

		//切换开关
		var lastIndex = -1,times = 0;
		$scope.checkList = function(index,e){
			e = e || window.event;
			e.preventDefault();
			times++;
			if(index === lastIndex){
				if(times%2 == 0){
		
					$scope.index = -1;
				}else{
					$scope.index =index;
				}
			}else{
				$scope.index =index;
			}
			// $scope.index = index;
			lastIndex = index;
		}


	}]);












