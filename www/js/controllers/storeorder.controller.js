angular.module('storeorder.controller', ['global', 'ionic','ykg.services'])
.controller('storeorderCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$window',
    '$timeout',
    '$ionicPopup',
    'GlobalVariable',
    'Message',
    'Storage',
    'postDataFty',
    'getCurrentUserFty',
    'getDataFty',    
    '$ionicHistory',
    '$location',
    '$filter',
    '$cacheFactory',
    'cacheFty',
    function ($rootScope,
        $scope,
        $state,
        $window,
        $timeout,
        $ionicPopup,
        GlobalVariable,
        Message,
        Storage,
        postDataFty,
        getCurrentUserFty,
        getDataFty,           
        $ionicHistory,
        $location,
        $filter,
        $cacheFactory,
        cacheFty) {

    // 分页请求 模板 =========================开始
      $scope.$on('$ionicView.beforeEnter', function(viewData){
        viewData.enableBack = true;
      })
          $scope.page = 1;//其实翻页
          $scope.orderList = new Array();//我的订单
          $scope.orderScale = '50%';
          var params = {};

          $scope.count = 0;//翻页的总数
          var userInfo = getCurrentUserFty.getCurrentUser();//获取当前用户信息
        

          $scope.nomore = false;//显示文字的
          var isLock = false;//上拉锁
          //请求数据
          $scope.loadMore = function () {
            if (isLock) {return};

            isLock = true;
            var url = GlobalVariable.SERVER_PATH + 'shop/shopbook/';
            if ($scope.count == 0 || $scope.count > $scope.orderList.length) {//如果数据还有
              // params['page']= $scope.page;
              params = {
                id: 1,
                page: $scope.page
              };

            var promise = postDataFty.postData(params, url);
              promise.then(function (data) {//成功处理函数
                alert(angular.toJson(data))
                if (data.count == 0) {
                    isLock = true;
                    $scope.nomore = true;
                } else {//如果有数据
                    for (var i = 0; i < data.ok.length; i++) {
                        data.ok[i].scale = data.ok[i].scale == 1.000 ? '100%' : '50%';
                    };

                  if (data.error == "1") {//如果被踢
                    Message.show('此账号已在其他设备登录', 1500);
                    $timeout(function () {
                        $location.path("/login");
                    }, 1400);

                  } else {
                    if (data.count != 0) {//如果数据长度大于0
                      // alert(data.count)
                      if ($scope.orderList.length == 0) {//如果是第一次加载数据
                        $scope.orderList = data.ok;
                      } else {//如果是第n+2次加载数据
                        $scope.orderList = $scope.orderList.concat(data.ok);
                      }

                  }
                  isLock = false;
                  $scope.count = data.count;
              };

              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.page += 1;
              $scope.orderScale = data.scale;
          }

              }, function (error) {//数据请求失败
                Message.show('获取信息失败', 1000);
                //5秒后再次请求一次
                setTimeout(function () {
                  // $scope.getInfo(params);
              }, 5000)
            })
            } else {//如果数据加载完了
                $scope.nomore = true;
                isLock = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            ;
        };

          //把商家选择的订单编号保存
          // $scope.cache   = $cacheFactory('cacheId');
          var oDate = Date.now() + '';
          $scope.selectedOrder = {
            orderNo : []
          };

          $scope.totalSum = 0;//订单总金额
          $scope.totalBackFund = 0;//让利金额
          $scope.collectOrder = function (je, back, id) {//je 单笔订单的金额，back返利金额， id选中的订单编号
              $("#" + id).toggle();
              alert(je+','+back+','+','+id)
            if ($scope.selectedOrder.orderNo.indexOf(id) == -1) {//第一次为选中订单，
              $scope.selectedOrder.orderNo.push(id);//把订单号放进数组
              $scope.totalSum += parseFloat(je+"")*parseFloat(je+""); //计算订单总额

              $scope.totalSum += parseFloat(Number(je)); //计算订单总额
              $scope.totalBackFund = Number($scope.totalBackFund);// 把让利额转成由字符转成数字方法计算
              $scope.totalBackFund += parseFloat(Number(back));//计算让利金额
              $scope.totalBackFund = $scope.totalBackFund.toFixed(2);// 取小数点后两位，防止长尾出现
              $("#" + id + "A").show();//选中标识打开

            } else {
              removeByValue($scope.selectedOrder.orderNo, id);//把订单号从数组中拿出来
              $scope.totalSum  -=parseFloat(je+"")*parseFloat(je+"");//计算订单总额
              $scope.totalSum -= parseFloat(Number(je));//计算订单总额
              $scope.totalBackFund = Number($scope.totalBackFund);// 把让利额转成由字符转成数字方法计算
              $scope.totalBackFund -= parseFloat(Number(back));//计算让利金额
              $scope.totalBackFund = $scope.totalBackFund.toFixed(2);// 取小数点后两位，防止长尾出现
              $("#" + id + "A").hide(); //选中标识隐藏
          }

          $scope.selectedOrder.sum = $scope.totalBackFund;
        }

        //反选操作
        function removeByValue(arr, val) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        }

        //状态切换
        $scope.checked = true;
        $scope.state = '未让利';
        $scope.orderState = '0';

        $scope.switchState = function (state) {
            $scope.state = state;
            switch (state) {
                case '未让利':
                $scope.orderState = '0';
                break;

                case '未审核':
                $scope.orderState = '1';
                break;

                case '交易成功':
                $scope.orderState = '2';
                break;
            }
        }

        //显示切换状态按钮
        $scope.showTabBar = function () {
            $scope.checked = !$scope.checked;
        };

        //订单状态过滤器
        $scope.myFilter = function (item) {
        // console.log(item.status                                                == $scope.orderState);
        // return item.status == $scope.orderState && item.time != null;
        return item.bookstate == $scope.orderState;
        // return item.status                                                     = '0';
        }

        //确定让利
        $scope.submit = function () {
            $scope.selectedOrder.orderNo[$scope.selectedOrder.orderNo.length] = $scope.selectedOrder.sum;
            cacheFty.setCache(oDate, 'orderno', $scope.selectedOrder.orderNo);
            $location.path('/transfer');
        };

       //返回按钮
      $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
          viewData.enableBack = true;
          // cacheFty.remove('orderno');//删除缓存
      });


         $scope.$on('$ionicView.afterEnter', function(){
            alert();
            $scope.loadMore();
        })

       


                

}])




