angular.module('commendqr.controller', ['ionic','ykg.services'])
.controller('commendqrCtrl', [
	'toggleFty',
	'$scope',
	'getDataFty',
	'GlobalVariable',
	function(
		toggleFty,
		$scope,
		getDataFty,
		GlobalVariable
		){


	$scope.$on('$ionicView.beforeEnter', function (event, viewData) {
  		 viewData.enableBack = true;
  	});

  	function getCommendCode(){
            var userInfo = getCurrentUserFty.getCurrentUser();
            var url = GlobalVariable.SERVER_PATH + '';
            var parmas = {
                uid:userInfo.id,
                rand:userInfo.rand
            }

        //取推荐二维码
        getDataFty.getData(parmas,url).then(
            function(data){
                 // $('.').html(data)
                // alert(angular.toJson(data))
                if(data.ok == 2){

                    $scope.qr = data.qr;

                }else{
                    // Message.show('')
                }
            },function(){

            })
        }

        getCommendCode();


	
}])