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
          // prefix='admin/';
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
                  params : {args : {}},
                  templateUrl: 'app/components/tenant/tenant.edit.html'
              })
              .state('app.tenantdetail', {
              url: prefix + 'tenant/detail',
              templateUrl: 'app/components/tenant/tenant.detail.html'
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
                  url: prefix + '/forgotpassword',
                  templateUrl: 'app/components/changepwd/change.password.html'
              })
              .state('app.airjetbook', {
                  url: prefix + '/airjetbook',
                  templateUrl: 'app/components/air-jet/airjet-book.html'

              })
              .state('app.editairjetbook', {
              url: prefix + '/airjetbook/edit/:username',
              params : {args : {}},
              templateUrl: 'app/components/air-jet/airjet-book.edit.html'
                })

              .state('app.airjets', {
                  url: prefix + '/airjets',
                  templateUrl: 'app/components/air-jet/airjets.html'

              })
              .state('app.editairjets', {
                  url: prefix + '/airjets/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/air-jet/airjets.edit.html'
              })

              .state('app.airjetcard', {
                  url: prefix + '/airjetcard',
                  templateUrl: 'app/components/air-jet/airjet-card.html'

              })
              .state('app.editairjetcard', {
                  url: prefix + '/airjetcard/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/air-jet/airjet-card.edit.html'
              })
              .state('app.airjetflight', {
                  url: prefix + '/airjetflight',
                  templateUrl: 'app/components/air-jet/airjet-flight.html'

              })
              .state('app.editairjetflight', {
                  url: prefix + '/airjetflight/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/air-jet/airjet-flight.edit.html'
              })
              .state('app.trainingschool', {
                  url: prefix + '/trainingschool',
                  templateUrl: 'app/components/training/training-school.html'

              })
              .state('app.edittrainingschool', {
                  url: prefix + '/trainingschool/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/training/training-school.edit.html'
              })
              .state('app.trainingclass', {
                  url: prefix + '/trainingclass',
                  templateUrl: 'app/components/training/training-class.html'
              })
              .state('app.edittrainingclass', {
                  url: prefix + '/trainingclass/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/training/training-class.edit.html'
              })
              .state('app.airtaxi', {
                  url: prefix + '/airtaxi',
                  templateUrl: 'app/components/air-taxi/airtaxi.html'

              })
              .state('app.editairtaxi', {
                  url: prefix + '/airtaxi/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/air-taxi/airtaxi.edit.html'
              })

              .state('app.airtour', {
                  url: prefix + '/airtour',
                  templateUrl: 'app/components/air-tour/airtour.html'

              })
              .state('app.editairtour', {
                  url: prefix + '/airtour/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/air-tour/airtour.edit.html'
              })

              .state('app.aircraft', {
                  url: prefix + '/aircraft',
                  templateUrl: 'app/components/aircraft/aircraft.html'

              })
              .state('app.editaircraft', {
                  url: prefix + '/aircraft/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/aircraft/aircraft.edit.html'
              })


              .state('app.airtrans', {
                  url: prefix + '/airtrans',
                  templateUrl: 'app/components/air-trans/airtrans.html'

              })
              .state('app.editairtrans', {
                  url: prefix + '/airtrans/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/air-trans/airtrans.edit.html'
              })

              .state('app.orderairtaxi', {
                  url: prefix + '/orderairtaxi',
                  templateUrl: 'app/components/order/order-airtaxi.html'

              })
              .state('app.editorderairtaxi', {
                  url: prefix + '/orderairtaxi/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/order/order-airtaxi.edit.html'
              })


              .state('app.orderairbook', {
                  url: prefix + '/orderairbook',
                  templateUrl: 'app/components/order/order-airbook.html'

              })
              .state('app.editorderairbook', {
                  url: prefix + '/orderairbook/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/order/order-airbook.edit.html'
              })



              .state('app.orderairbookquick', {
                  url: prefix + '/orderairbookquick',
                  templateUrl: 'app/components/order/order-airbook-quick.html'

              })
              .state('app.editorderairbookquick', {
                  url: prefix + '/orderairbookquick/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/order/order-airbook-quick.edit.html'
              })


              .state('app.orderairtour', {
                  url: prefix + '/orderairtour',
                  templateUrl: 'app/components/order/order-airtour.html'

              })
              .state('app.editorderairtour', {
                  url: prefix + '/orderairtour/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/order/order-airtour.edit.html'
              })


              .state('app.orderairtrans', {
                  url: prefix + '/orderairtrans',
                  templateUrl: 'app/components/order/order-airtrans.html'

              })
              .state('app.editorderairtrans', {
                  url: prefix + '/orderairtrans/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/order/order-airtrans.edit.html'
              })



              .state('app.orderclass', {
                  url: prefix + '/orderclass',
                  templateUrl: 'app/components/order/order-class.html'

              })
              .state('app.editorderclass', {
                  url: prefix + '/orderclass/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/order/order-class.edit.html'
              })

              .state('app.orderairjet', {
                  url: prefix + '/orderairjet',
                  templateUrl: 'app/components/order/order-airjet.html'

              })
              .state('app.editorderairjet', {
                  url: prefix + '/orderairjet/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/order/order-airjet.edit.html'
              })



              .state('app.orderflight', {
                  url: prefix + '/orderflight',
                  templateUrl: 'app/components/order/order-flight.html'

              })
              .state('app.editorderflight', {
                  url: prefix + '/orderflight/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/order/order-flight.edit.html'
              })
              .state('app.ordercard', {
                  url: prefix + '/ordercard',
                  templateUrl: 'app/components/order/order-card.html'

              })
              .state('app.editordercard', {
                  url: prefix + '/ordercard/edit/:username',
                  params : {args : {}},
                  templateUrl: 'app/components/order/order-card.edit.html'
              })

             /* .state('app.orderflight', {
                  url: prefix + '/orderflight',
                  templateUrl: 'app/components/order/order-tabairjet.html'

              })*/


              /*.state('app.orderairjet', {
                  url: '/orderairjet',
                  params : {args : {}},
                  views:{
                      '':{templateUrl: 'app/components/order/order-airjet.html'}
                  }
              })*/


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
