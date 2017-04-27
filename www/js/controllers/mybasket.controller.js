angular.module('mybasket.controller', ['ykg.services','global'])
.controller('mybasketCtrl', [
  '$scope',
  'Storage',
  '$state',
  'Message',
  '$timeout',
  'getCurrentUserFty',
  'getDataFty',
  'GlobalVariable',
  'cacheFty',
  'postDataFty',
  '$location',
  'cacheFty',
  function (
    $scope,
    Storage,
    $state,
    Message,
    $timeout,
    getCurrentUserFty,
    getDataFty,
    GlobalVariable,
    cacheFty,
    postDataFty,
    $location,
    cacheFty) {

    $scope.$on('$ionicView.beforeEnter', function (event, viewDate) {
      viewDate.enableBack = true;
    })

    $scope.datas = null;
    var userInfo = getCurrentUserFty.getCurrentUser();
    function getGoods(){
      var url = GlobalVariable.SERVER_PATH + 'shop/shopcartbook';
      var params= {
        id:userInfo.info.userid
    }

    postDataFty.postData(params, url).then(
        function(data){
          console.log(angular.toJson(data.ok))
          $scope.datas = data.ok;
        },function(error){
          $timeout(function(){
            getGoods();
          },2000)
          // Message.show('获取购物车定单失败', 1600)
        })
    };

    //选择商家
    $scope.index = {}, oldIndex = {}, goodsArr = [];

    $scope.selectGoods = function(index){
      for(var i = 0; i < $scope.datas.length; i++){
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
            goodsArr.push($scope.datas[i]);
              
          } 
        }else{//非点击的项
          if(oldIndex[i] == i){//如果之前有选中的
            $scope.index[i] = i;
          }else{//其他全部变成非选中
            $scope.index[i] = -1;
          }
        }
        
      }
      console.log(angular.toJson(goodsArr))
    };

    //删除定单
    $scope.deleteOrder = function(){
      // console.log(angular.toJson(goodsArr[0].shopcartid))
        var url = GlobalVariable.SERVER_PATH + 'shop/delectbook';
        var list = [];
        for(var i = 0; i < goodsArr.length; i++){
          list.push(goodsArr[i].shopcartid);
        }
        var params = {id:list}
        console.log(angular.toJson(params))
  
        postDataFty.postData(params, url).then(
          function(data){
            Message.show('删除成功',1200)
            getGoods();
            
          },function(error){
              Message.show('网络出现问题,重试一下', 1600)
          });
    }
    
    //去购买
    $scope.pay  = function(){
      var oDate = Date.now()
      if($scope.datas.length == 0){
        Message.show('没有订单可以提交，购物车是空的',1600);
      }else{
        cacheFty.setCache(oDate, 'toPayList', goodsArr)//要支付订单列表 
        $location.path('/pay');
      } 
    };

    $scope.$on('$ionicView.afterEnter', function(){
       getGoods();
    })

    $scope.$on('$ionicView.beforeEnter', function(){
       if(cacheFty.getCache('sum')){
          cacheFty.remove();
       }
    })

  }]);