(function () {
    'use strict';

    angular
        .module('iot')
        .config(routeConfig)
        .run(function($rootScope, $state, $stateParams,constdata,$location,UserInfoServer) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.pageRoutes = [];
        var count = 0;
        // $rootScope.$on("$stateChangeStart",function(event, toState, toParams, fromState, fromParams) {
        //   if(toState.name == 'app.tenant') {
        //     $rootScope.pageRoutes = [];
        //   }
        // })
        $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
            // to be used for back button //won't work when page is reloaded.
            $rootScope.previousState_name = fromState.name;
            $rootScope.previousState_params = fromParams;
            var stateText = toState.name.replace(/\./g,'');
            var myUrl = eval("constdata.routeName."+stateText);
            //console.log(stateText);
            var routeObj = {
              url : myUrl,
              name : toState.name,
              params : fromParams
            }
            //console.log(routeObj);
            $rootScope.pageRoutes.push(routeObj);
            var len = $rootScope.pageRoutes.length;
            //对后追加的两个routeName进行去重处理
            checkLastTwoRoute($rootScope.pageRoutes);
            //点击一级把一级和后面所有的route全部去掉
            removeRootRoute($rootScope.pageRoutes);
            //去掉同一级别的route及以后的route
            removeLowerLevelRoute($rootScope.pageRoutes);

            //数组去重处理函数
            function checkLastTwoRoute(arr) {
              var arrLen = arr.length;
              if(arrLen>=2) {
                //后两个重复处理
                if(arr[arrLen-1].url == arr[arrLen-2].url) {
                  arr.splice(arrLen-1,1);
                  return;
                }
                //最后一个和前面的某一个重复处理
                var arrExceptLast = arr.slice(0, arrLen-2);
                var urlArrExceptLast = [];
                arrExceptLast.forEach(function(item, index) {
                  urlArrExceptLast.push(item.url);
                });
                var findIndex = urlArrExceptLast.indexOf(arr[arrLen-1].url);
                findIndex>=0 ? arr.splice(findIndex+1) : console.log();
              }
            }
            //去除根route及后面所有的route
            function removeRootRoute(arr) {
              var arrLen = arr.length;
              var blackList = [
                'app.dashboard','app.tenant','app.profile',
                'app.logging','app.monitoring','app.settings',
                'app.edittenant'
              ];
              if(arrLen>=1) {
                blackList.indexOf(arr[arrLen-1].name) >=0 ? arr.splice(0) : console.log();
              }
            }
            //点击某级别切换同级别并且去掉后面所有的route
            function removeLowerLevelRoute(arr2) {
              var levelNameArrs = [
                ['app.productTab',
                'app.productTab.productTopic',
                'app.productTab.productEventMapping',
                'app.productTab.productNotificationTopic'],
                ['app.sdkEdit',
                'app.sdkEdit.editProfile',
                'app.sdkEdit.editConfiguration',
                'app.sdkEdit.editNotification',
                'app.sdkEdit.editData'],
                ['app.applicationDetail.basic',
                'app.applicationDetail.event',
                'app.applicationDetail.verify']
              ];
              var allLen = arr2.length;
              var lastSecondIndex = -1;
              var sameLevelFlag = false;
              var lastSecondInThisArr = null;
              //连续两个同一级别处理
              if(allLen>=2) {
                levelNameArrs.forEach(function(item, index) {
                  var itemNameArr = [];
                  item.indexOf(arr2[allLen-2].name)>=0 ? lastSecondInThisArr=item : console.log();
                });
                if(lastSecondInThisArr) {
                  var lastIndex = lastSecondInThisArr.indexOf(arr2[allLen-1].name);
                  if(lastIndex>=0) {
                    //说明出现了两个同一级别的，把倒数第二个route从总数组中去掉
                    arr2.splice(allLen-2,1);
                  }
                }
              }
              //最后一个route是产品、应用、设备、事件时特殊处理
              var specialRouteName = [
                'app.product',
                'app.application',
                'app.event',
                'app.devicemanager'
              ]
              //只是租户身份，界面需要这步
              if($rootScope.isRoleAdmin) {
                ;
              } else {
                if(arr2.length>0) {
                  var specialRouteIndex = specialRouteName.indexOf(arr2[arr2.length-1].name);
                  if( specialRouteIndex>=0 ) {
                    arr2.splice(0,arr2.length-1);
                  }
                }
              }
            }
            var tenant = localStorage.getItem(constdata.tenant);
            if (tenant && tenant.length > 0){
                var prefix = 'innovation-' + tenant;
                var tp = toParams.hasOwnProperty('t');
                if(tp){
                    var ourl = toState.url;
                    ourl = ourl.replace('{t}',prefix);
                    var pkeys = Object.getOwnPropertyNames(toParams);
                    for (var i = 0; i < pkeys.length; i++){
                        var k = pkeys[i];
                        var val = toParams[k];
                        if (k != 't') {
                            if (k != 'args'){
                                ourl = ourl.replace(':' + k,val);
                            }
                        }
                    }
                    $location.path(ourl);
                }
            }else{
 
                var prefix = UserInfoServer.tenantName();
                var tp = toParams.hasOwnProperty('t');

                if(tp){
                    var ourl = toState.url;
                    ourl = ourl.replace('{t}',prefix);
                    // console.log('R:' + ourl);
                    var pkeys = Object.getOwnPropertyNames(toParams);
                    for (var i = 0; i < pkeys.length; i++){
                        var k = pkeys[i];
                        var val = toParams[k];
                        if (k != 't') {
                            if (k != 'args'){
                                ourl = ourl.replace(':' + k,val);
                            }
                        }
                        // console.log('result ' + ourl);
                    }
                    $location.path(ourl);
                }
               
            }




        });
        //back button function called from back button's ng-click="backPre()"
        $rootScope.backPre = function() {//实现返回的函数
            $state.go($rootScope.previousState_name,$rootScope.previousState_params);
        };
    });

    /** @ngInject */

    function routeConfig($stateProvider, $urlRouterProvider,unicornLauncherProvider) {


        // $locationProvider.html5Mode(true);

          var username =  unicornLauncherProvider.username();
          var prefix = username + '/';
          if (!username || username == 'undefined'){
              prefix = 'user/';
          }else{
              prefix = username + '/';
          };
           prefix='admin/';
          $urlRouterProvider
            .otherwise('/access/signin');
          $stateProvider
              .state('app', {
                  //abstract: true,
                  url: '/',
                  controller: 'MainController',
                  controllerAs: 'main',
                  templateUrl: 'app/main/main.html',
              })
              .state('app.dashboard', {
                  url: prefix + 'dashboard',
                  templateUrl: 'app/components/dashboard/dashboard.tpl.html'
              })
              .state('app.profile', {
                  url: prefix + 'profile',
                  templateUrl: 'app/components/profile/profile.html'
              })
              .state('app.tenant', {
                  url: prefix + 'tenant',
                  templateUrl: 'app/components/tenant/tenant.html'
              })
              .state('app.customTenantDashboard', {
                  url: prefix + '{t}/dashboard',
                  templateUrl: 'app/components/dashboard/dashboard.tenant.custom.html',
                  params:{args:{}}
              })
              .state('app.edittenant', {
                  url: prefix + 'tenant/edit/:username',
                  templateUrl: 'app/components/tenant/tenant.edit.html'
              })
              .state('app.application', {
                  url: prefix + '{t}/application',
                  templateUrl: 'app/components/application/application.html'
              })
              .state('app.applicationDetail', {
                  url: prefix + ':HNATenantName/application/detail/:applicationName',
                  params : {args : {}},
                  views:{
                      '':{templateUrl: 'app/components/application/application.detail.html'},
                      '@app.applicationDetail':{templateUrl: 'app/components/application/application.detail.basic.html'}
                  }
              })
              .state('app.applicationDetail.basic', {
                  url: '/basic',
                  params : {args : {}},
                  views:{
                      '':{templateUrl: 'app/components/application/application.detail.basic.html'}
                  }
              })
              .state('app.applicationDetail.deploy', {
                  url: '/deploy',
                  params : {args : {}},
                  views:{
                      '':{templateUrl: 'app/components/application/application.detail.deployInfo.html'}
                  }
              })
              .state('app.applicationDetail.monitor', {
                  url: '/monitor',
                  params : {args : {}},
                  views:{
                      '':{templateUrl: 'app/components/application/application.detail.monitorInfo.html'}
                  }
              })
              .state('app.applicationDetail.log', {
                  url: '/log',
                  params : {args : {}},
                  views:{
                      '':{templateUrl: 'app/components/application/application.detail.logInfo.html'}
                  }
              })
              .state('app.addVerify', {
                  url: prefix + ':HNATenantName/application/applicationDetail/app1/verify/add',
                  params : {args : {}},
                  views:{
                      '':{templateUrl: 'app/components/application/application.detail.verify.add.html'}
                  }
              })
              .state('app.applicationedit', {
                  url: prefix + '{t}/application/edit/:applicationName',
                  templateUrl: 'app/components/application/application.edit.html'
              })
              .state('app.applicationDeploy', {
                  url: prefix + '{t}/application/deploy/:applicationName',
                  params : {args : {}},
                  templateUrl: 'app/components/application/application.deploy.html'
              })
              .state('app.applicationImage', {
                  url: prefix + '{t}/application/image/:applicationName',
                  params : {args : {}},
                  templateUrl: 'app/components/application/application.image.html'
              })
              .state('app.addMapping4Application', {
                  url: prefix + ':HNATenantName/:targetName/addEventMapping',
                  templateUrl: 'app/components/application/application.mapping.add.html',
                  params : {args : {}}
              })
              .state('app.amendForm', {
                  url: prefix + 'application',
                  templateUrl: 'app/components/application/application.edit.html'
              })
              .state('app.product', {
                  url: prefix + '{t}/product',
                  templateUrl: 'app/components/product/product.html'
              })
              .state('app.productTab', {
                  url: prefix + ':HNATenantName/product/detail',
                  params : {args : {}},
                  views: {
                      '': {
                          templateUrl: 'app/components/product/product.tab.html'
                      },
                      'sdkContent@app.productTab' : {
                          templateUrl: 'app/components/product/product.sdk.list.html'
                      }
                  }
                  // cache: true
              })
              .state('app.addSdk', {
                  url: prefix + '{t}/product/add-sdk',
                  templateUrl: 'app/components/product/product.sdk.add.html',
                  params : {args : {}}
              })
              .state('app.productTab.productTopic', {
                  url: prefix + '/topic',
                  views: {
                      'sdkContent@app.productTab' : {
                          templateUrl: 'app/components/product/product.topic.html'
                      }
                  },
                  params : {args : {}},
                  // cache: false
              })
              .state('app.productTab.productApi', {
                  url: prefix + '/topic',
                  views: {
                      'sdkContent@app.productTab' : {
                          templateUrl: 'app/components/product/product.api.html'
                      }
                  },
                  params : {args : {}},
                  // cache: false
              })
              .state('app.editTopic', {
                  url: prefix + 'edit-topic',
                  templateUrl: 'app/components/product/product.topic.edit.html',
                  params:{args:{}}
              })
              .state('app.addTopic', {
                  url: prefix + 'products/product-tabs/add-topic',
                  templateUrl: 'app/components/product/product.topic.add.html',
                  params:{args:{}}
              })
              .state('app.productTab.productEventMapping', {
                  url: prefix + '/eventmapping',
                  views: {
                      'sdkContent@app.productTab' : {
                          templateUrl: 'app/components/product/product.event.mapping.html'
                      }
                  },
                  params : {args : {}},
                  cache: false
              })
              .state('app.productTab.productNotificationTopic', {
                  url: prefix + '/notification-topic',
                  views: {
                      'sdkContent@app.productTab' : {
                          templateUrl: 'app/components/product/product.notification.html'
                      }
                  },
                  params : {args : {}},
                  cache: false
              })
              .state('app.addForm', {
                  url : prefix + '{t}/product/add/:proName',
                  templateUrl: 'app/components/product/product.add.html',
                  cache:false
              })
              .state('app.sdkEdit', {
                  url: prefix + ':HNATenantName/product/sdk-edit',
                  views: {
                  	  '': {
                          templateUrl: 'app/components/product/sdkedit/sdkedit.html'
                      },
                      'basic@app.sdkEdit' : {
                          templateUrl: 'app/components/product/sdkedit/sdkedit.basic.html'
                      }
                  },
                  params : {args : {}}
              })
              .state('app.sdkEdit.editProfile', {
                  url: '/profile',
                  views: {
                      'basic@app.sdkEdit' : {
                          templateUrl: 'app/components/product/sdkedit/sdkedit.profile.html'
                      }
                  },
                  params : {args : {}},
                  
              })
              .state('app.sdkEdit.editConfiguration', {
                  url: '/configuration',
                  views: {
                      'basic@app.sdkEdit' : {
                          templateUrl: 'app/components/product/sdkedit/sdkedit.configuration.html'
                      }
                  },
                  params : {args : {}}
              })
              .state('app.sdkEdit.editNotification', {
                  url: '/notification',
                  views: {
                      'basic@app.sdkEdit' : {
                          templateUrl: 'app/components/product/sdkedit/sdkedit.notification.html'
                      }
                  },
                  params : {args : {}}
              })
              .state('app.sdkEdit.editData', {
                  url: '/data',
                  views: {
                      'basic@app.sdkEdit' : {
                          templateUrl: 'app/components/product/sdkedit/sdkedit.data.html'
                      }
                  },
                  params : {args : {}}
              })
              .state('app.addEventMapping', {
                  url : prefix + 'product/eventmapping/add-eventmapping',
                  templateUrl : 'app/components/product/addEventMapping.html',
                  params:{args:{}}
              })
              .state('app.editEvent', {
                  url: 'product/detail/eventmapping/:evId',
                  templateUrl: 'app/components/product/product.event.mapping.detail.html',
                  params:{args:{}}
              })
              .state('app.eventMpApplication', {
                  url: 'app/eventmapping-detail/:evId',
                  templateUrl: 'app/components/application/application.event.mapping.detail.html',
                  params:{args:{}}
              })
              .state('app.addDeviceGroup', {
                  url: prefix + 'product/add-dg/add-devicegroup',
                  templateUrl: 'app/components/product/addDeviceGroup.html'
              })
              .state('app.editDeviceGroup', {
                  url: prefix + 'product/edit-devicegroup/:DGId',
                  templateUrl: 'app/components/product/editDeviceGroup.html'
              })
              .state('app.sendNoification', {
                  url: prefix + 'products/product-tabs/send-noification',
                  templateUrl: 'app/components/product/product.notification.send.html',
                  params:{args:{}}
              })
              //device manager
              .state('app.devicemanager', {
                  url: prefix + '{t}/devicemanager/device',
                  templateUrl: 'app/components/devicemanager/device.manager.html'
              })
              .state('app.credential', {
                  url: prefix + '{t}/devicemanager/credential',
                  templateUrl: 'app/components/devicemanager/device.manager.credential.html'
              })
              .state('app.editDeviceManager', {
                  url: prefix + '{t}/editDeviceManager/:deviceId',
                  templateUrl: 'app/components/devicemanager/edit.devicemanager.html',
                  params:{args:{}}
              })
            .state('app.editCredential', {
                url: prefix + '{t}/devicemanager/credential/edit/:deviceId',
                templateUrl: 'app/components/devicemanager/device.manager.credential.edit.html',
                params:{args:{}}
            })
              .state('app.event', {
                  url: prefix + '{t}/event',
                  templateUrl: 'app/components/event/event.html'
              })
              .state('app.addEvent', {
                  url: prefix + '{t}/event/add',
                  templateUrl: 'app/components/event/event.add.html'
              })
              .state('app.editback', {
                  url: prefix + '{t}/event',
                  templateUrl: 'app/components/event/event.html',
              })
              .state('app.eventclassfamily', {
                  url: prefix + ':HNATenantName/event/info:eventId',
                  views:{
                  	'':{templateUrl: 'app/components/event/event.class.family.html'},
                  	'@app.eventclassfamily':{templateUrl: 'app/components/event/event.class.add.html'}
                  },params:{args:{}}
              })
              .state('app.eventclassfamily.basic',{
                  url:'/basic',
                  templateUrl: 'app/components/event/event.class.add.html'
              })
              .state('app.eventclassfamily.event',{
                  url:'/add',
                  templateUrl: 'app/components/event/event.add.fields.html'
              })
              .state('app.jumpeventclass', {
                  url: prefix + 'event',
                  templateUrl: 'app/components/event/eventSchema.html'
              })
              .state('app.logging', {
                  url: prefix + 'logging',
                  views:{
                      '':{templateUrl: 'app/components/logging/logging.html'},
                      'columnOne@app.logging': { template: 'Look I am 0 column!' },
                      'columnTwo@app.logging': { template: 'Look I am 1 column!' },
                      'columnThree@app.logging': { template: 'Look I am 2 column!' },
                      'columnFour@app.logging': { template: 'Look I am 3 column!' },
                  }
              })
              .state('app.monitoring', {
                  url: prefix + 'monitoring',
                  templateUrl: 'app/components/monitoring/monitoring.html'
              })
              .state('app.settings', {
                  url: prefix + 'settings',
                  templateUrl: 'app/components/settings/settings.html'
              })
              .state('app.editMonitoring', {
                  url: prefix + 'monitoring',
                  templateUrl: 'app/components/monitoring/edit.monitoring.html'
              })
              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })
              .state('access.signin', {
                  url: '/signin',
                  templateUrl: 'app/components/login/signin.html',
                  controller: 'LoginController',
                  controllerAs: 'vm'
              })
              .state('access.register', {
                  url: '/register',
                  templateUrl: 'app/components/register/register.html',
                  controller: 'RegisterController',
                  controllerAs: 'vm'
              })
              .state('access.changepsd', {
                  url: '/forgotpassword',
                  templateUrl: 'app/components/changepwd/change.password.html'
              })
          ;
    }


    /** ngInject */
   /*
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .otherwise({
                redirectTo: '/'
            });
    }*/

})();
