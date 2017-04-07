angular.module('ui.router.requirePolyfill', ['ng', 'ui.router', 'oc.lazyLoad'])
    .decorator('uiViewDirective', DecoratorConstructor);

  /**
   * 装饰uiView指令,给其加入按需加载的能力
   */
  DecoratorConstructor.$inject = ['$delegate', '$log', '$q', '$compile', '$controller', '$interpolate', '$state', '$ocLazyLoad'];
  function DecoratorConstructor($delegate, $log, $q, $compile, $controller, $interpolate, $state, $ocLazyLoad) {

    // 移除原始指令逻辑
    $delegate.pop();
    // 在原始ui-router的模版加载逻辑中加入脚本请求代码,实现按需加载需求
    $delegate.push({

      restrict: 'ECA',
      priority: -400,
      compile : function (tElement) {
        var initial = tElement.html();
        return function (scope, $element, attrs) {

          var current = $state.$current,
            name = getUiViewName(scope, attrs, $element, $interpolate),
            locals = current && current.locals[name];

          if (!locals) {
            return;
          }

          $element.data('$uiView', {name: name, state: locals.$$state});

          var template = locals.$template ? locals.$template : initial,
            processResult = processTpl(template);

          var compileTemplate = function () {
            $element.html(processResult.tpl);

            var link = $compile($element.contents());

            if (locals.$$controller) {
              locals.$scope = scope;
              locals.$element = $element;
              var controller = $controller(locals.$$controller, locals);
              if (locals.$$controllerAs) {
                scope[locals.$$controllerAs] = controller;
              }
              $element.data('$ngControllerController', controller);
              $element.children().data('$ngControllerController', controller);
            }

            link(scope);
          };

          // 主要实现
          // 模版中不含脚本则直接编译,否则在获取完脚本之后再做编译
          if (processResult.scripts.length) {
            loadScripts(processResult.scripts).then(compileTemplate);
          } else {
            compileTemplate();
          }

        };
      }
    });
     return $delegate;
  }
   

    
