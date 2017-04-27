angular.module('tabs.account.controller', ['ionic','ykg.services','global','ngAnimate'])
.controller('accountCtrl', [
	'toggleFty',
	'$scope',
	'postDataFty',
	'getDataFty',
	'Message',
	'GlobalVariable',
	'$animate',
	'$ionicScrollDelegate',
  'getCurrentUserFty',
  'Storage',
  'popupFty',
  '$location',
	function(
		toggleFty,
		$scope,
		postDataFty,
		getDataFty,
		Message,
		GlobalVariable,
		$animate,
		$ionicScrollDelegate,
    getCurrentUserFty,
    Storage,
    popupFty,
    $location
		){
		
    //个人中心头部伸缩
		$scope.zoom = function(){
			distance = $ionicScrollDelegate.getScrollPosition();
			
			if(distance.top > 10){
				$('.bar-profile:eq(0)').addClass('zoom');
			}else if(distance.top <= 10){
				$('.bar-profile:eq(0)').removeClass('zoom');
			}	
		};

    if(localStorage["touxiang"]){
          var image = document.getElementById('touxiang');
          image.src = "data:image/jpeg;base64," + localStorage["touxiang"];
    };
   

    //监听页面加载事件
    //身份筛查
    $scope.userInfo = getCurrentUserFty.getCurrentUser();
    

    $scope.$on('$ionicView.afterEnter', function(){
      $scope.showMore();  
      getaccount(); 
    })

    $scope.$on('$ionicView.beforeEnter', function(){
      
      $scope.userinfo=null;//用户信息
      $scope.merchant = Number( $scope.userInfo.info.isshop); //商家
      $scope.reseller = Number( $scope.userInfo.info.istg) == -1?0:Number( $scope.userInfo.info.resellerlevel); //推广员
      $scope.resellshop = Number( $scope.userInfo.info.isresellshop) == NaN ? 0 : Number( $scope.userInfo.info.isresellshop);;  //代理商
      $scope.referbywho =  $scope.userInfo.info.refername ?  $scope.userInfo.info.info.refername:'总部推荐';
      // $scope.isMerchant =  $scope.userInfo.info.isshop >= 2? $scope.userInfo.isshop = '商' : false;//判断是不是商家，然后再显示图标
    })

    // //个人帐户信息
    function getaccount (){
      var url =  GlobalVariable.SERVER_PATH + 'info/info/';
      var params = {
        id: $scope.userInfo.info.userid
      }
      // alert(params.id)
      postDataFty.postData(params, url).then(
        function(data){
          //冻结的钱
          $scope.account = data.info
          $scope.unfreeze = Number(data.money.freezemoney);
          //已经解冻的钱
          $scope.normal = Number(data.money.kt);
          Storage.set('account',data);
      },function(error){
        // Message.show('网络出错了，重试一次或稍候再试')
      })
    }

    //去提现页
    $scope.goWithdraw = function(){
      if($scope.userInfo.info.isshop == 2){//是商家
        $location.path('/withdraw');
      }else if($scope.userInfo.info.isresellshop == 1){//是代理
        $location.path('/withdraw');
      }else if($scope.userInfo.info.isshop == 1){//商家申请在审核
        waite();
      }else if($scope.userInfo.info.isresellshop == 0 && $scope.userInfo.info.isresellshop == 0){//不是商家也不是代理
        notAgency();
      }
    };

     //去解冻页
    $scope.unfreeze = function(){
      if($scope.userInfo.info.isshop == 0){
        notShop();
      }else if($scope.userInfo.info.isshop == 1){
        waite();
      }else{
        $location.path('/advance');
      }
    };

    function notShop(){
      popupFty.AlertPopup(
        '申请成为商家',
        '你还不是商家，点击申请填写资料，待审核审核通过后，即可成为商家',
        '申请',
        function(){}
      );

    };

    function waite(){
      popupFty.AlertPopup(
        '审核中',
        '你的申请已经提交成功，由于申请人数较多，请等待2-5个工作日。',
        '知道了',
        function(){}
      );
    };

    function notAgency(){
      popupFty.confirmPopup(
        '提示',
        '你不是商家也不是代理商家。',
        '申请成为商家',
        function(){
          $location.path('/applyShop');
        }
      );
    };
   
    
    //加载获取个人页面信息
    // $scope.getInfo = function(params){
    //   var url = GlobalVariable.SERVER_PATH+'Home/Index/personinfo/';
    //   var url2 = GlobalVariable.SERVER_PATH +  'Home/Index/appre/?uid='+params.uid+'&rand='+params.rand;//触发推广和提招商员
    //   var promise = postDataFty.postData(params,url);

    //   promise.then(function(data){
    //     $scope.userinfo = data;
    //     Storage.set("logined",$scope.userinfo);
    //     $scope.temp_leavl={};
    //             $scope.zjf  = parseInt(Number(userInfo.xiaofeijf)) + parseInt(Number(userInfo.xiaoshoujf));//总积分
    //             $scope.btbz = parseInt(Number(userInfo.tuiguangjiangli))//补贴补助

    //             $scope.khgjf = parseInt(userInfo.kehuigoujf)+parseInt(userInfo.kehuigoujfsj);//可回购积分

    //             for(var i = 0; i<5; i++){
    //                 var temp = new Array();
    //                 var temp_level=null;
    //                 if(i == 0){
    //                     temp_level=$scope.userinfo.buyerlevel;//消费者
    //                 }else if(i == 1){
    //                     temp_level=$scope.userinfo.resellerlevel;//推广员
    //                 }else if(i == 2){
    //         temp_level=$scope.userinfo.serivcelevel;//服务商家
    //       }else if(i == 3){
    //         temp_level=$scope.userinfo.zhaoshanglevel;//招商员
    //       }else{
    //         temp_level=$scope.userinfo.resellshoplevel;//代理商家
    //       }

    //       for(var j = 1; j < 4; j++){
    //        //  if(j <= temp_level){
    //        //    if(temp_level >= 1){
    //        //      temp[j] = 1;
    //        //    }   
    //        // }else{}
    //        if(temp_level >= j){
    //           temp[j] = 1;
    //        }else{
    //         temp[j] = 0;
    //        }
    //      }
    //      $scope.temp_leavl['jf'+i] = temp;
    //    }
    //             // console.log($scope.temp_leavl);
    //         },function(){
    //    Message.show('获取信息失败,请刷新页面',1200);

    //  })
    // };

    //更多信息的开关
    var params = true;
    $scope.show = true;
    $scope.showMore = function(){
      params = !params;
      $scope.show = toggleFty.actions(params); 
    };



           
}])