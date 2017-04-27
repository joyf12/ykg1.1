
angular.module('newscontent.controller', ['ykg.services', 'global'])
  .controller('newscontentCtrl', ['$scope',
   '$state',
   'GlobalVariable',
   'Message',
   'Storage',
   '$stateParams',
   '$timeout' ,
   'postDataFty',
  	function (
	  	$scope,
	  	$state,
	  	GlobalVariable,
	  	Message,
	  	Storage,
	  	$stateParams,
	  	$timeout,
	  	postDataFty) {
  		
		$scope.$on('$ionicView.beforeEnter', function(event, viewData){
			viewData.enableBack = true;
		});

		var newsId = $stateParams.newsId;

		
		
		// 页面清除时，停止定时器
		$scope.$on('$destroy',function(){	
		});

		function getNews () {
			var url = GlobalVariable.SERVER_PATH + 'Index/news';
		  	postDataFty.postData(null, url).then(function(data){
		  		if(data.ok){
		  			var res = data.ok;
		  			alert
		  			for( var i = 0; i < res.length; i++){

		  				if(res[i].id == newsId){
		  					$scope.news = res[i];
		  					
		  				}
		  			}
		  		}	
		  	},function(error){
		  		Message.show('新闻获取失败了，重试一次',1600,function(){
		  			getNews
		  		})

		  	})
		};

		$scope.$on('$ionicView.afterEnter', function(){
			getNews ();
		})

		
		
		

   }]);

