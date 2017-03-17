/* global angular:false, malarkey:false, moment:false */
(function () {
    'use strict';

    // Constants used by the entire app
    angular.module('iot')
        .constant('malarkey', malarkey)
        .constant('moment', moment)
        .constant('constdata', {
            debugMode: false,
            logLevel: 100000,//控制log显示的级别（0不显示,1显示）,从左到右每位分别代表[error,warn,info,debug,log]
            // apiHost:'http://10.71.86.222:8888/iot/api/v1/',
            apiHost_ONLINE:'http://223.202.32.52/stage/iot/api/v1/',
            apiHost_OFFLINE:'http://10.71.86.222:8888/iot/api/v1/',
			tenant:'hna-tenant',
            api:{ "token":{"refresh":"account/token/refresh"},
                    "login":
                        {"authPath":"account/auth", "profilePath":"account/profile", "changePSDPath":"account/password/change","updatePath":"account/profile"},
                    "tenant":
                        {"listAllPath":"tenants","updatePath":"tenants","deletePath":"tenants","tenantInfoPath":"tenants","addPath":"tenants","lockPath":"tenants"},
                    "device":
                        {"listAllPath":"devices","updatePath":"devices/device1","deletePath":"devices/device1","deviceInfoPath":"devices/id","addPath":"devices"},
                    "product":
                        {"listAllPath":"products","updatePath":"products","deletePath":"products","productInfoPath":"products","addPath":"products",
                            "addSdkPath":"products","deleteSdkPath":"products","addTopicPath":"products","topicListAllPath":"products","topicUpdatePath":"products","topicDeletePath":"products" , 
                            "getdevicegroup":"products","productPath":"products","profileInfoPath":"products","profileDeletePath":"products","profileUpdatePath":"products","configInfoPath":"products",
                            "configUpdatePath":"products","sendNotiTopicPath":"notifications/broadcast?product=",
                            "notificationInfoPath":"products","notificationUpdatePath":"products","dataInfoPath":"products","dataUpdatePath":"products","downLoadSdkPath":"products",
                        },
                    "application":
                        {"appsPath":"apps"},
                    "event":
                        {"eventPath":"events"},
                    "plugin":"plugin/",
                    "dashboard":{"metrics":"metrics"}
            },
            routeName:{
                "appprofile":"个人中心",
                "apptenant":"租户管理",
                "appmonitoring":"监测",
                "applogging":"日志",
                "appsettings":"设置",
                "appdashboard":"管理员仪表盘",
                "appcustomTenantDashboard":"租户仪表盘",
                "appcustomTenantDashboard_product":"产品管理",
                "appcustomTenantDashboard_application":"应用管理",
                "appcustomTenantDashboard_event":"事件管理",
                "appcustomTenantDashboard_deviceManager":"设备管理",
                "appedittenant":"编辑租户",
                "appapplication":"应用管理",
                "appapplicationDetail":"应用详情",
                "appapplicationDetailbasic":"基本信息",
                "appapplicationDetailevent":"事件映射",
                "appapplicationDetailverify":"用户验证",
                "appaddVerify":"添加验证",
                "appapplicationedit":"编辑应用",
                "appaddMapping4Application":"添加事件映射",
                "appamendForm":"修改应用",
                "appproduct":"产品管理",
                "appproductTab":"产品定义",
                "appaddSdk":"添加SDK",
                "appproductTabproductTopic":"主题定义",
                "appeditTopic":"编辑主题",
                "appaddTopic":"添加主题",
                "appproductTabproductEventMapping":"事件映射",
                "appproductTabproductNotificationTopic":"通知定义",
                "appaddForm":"添加产品",
                "appsdkEdit":"基本信息",
                "appsdkEditeditProfile":"设备属性定义",
                "appsdkEditeditConfiguration":"配置定义",
                "appsdkEditeditNotification":"通知定义",
                "appsdkEditeditData":"数据采集定义",
                "appaddEventMapping":"添加事件映射",
                "appeditEvent":"编辑事件",
                "appeventMpApplication":"事件映射详情",
                "appaddDeviceGroup":"添加设备",
                "appeditDeviceGroup":"编辑设备",
                "appsendNoification":"发送通知",
                "appdevicemanager":"设备管理",
                "appcredential":"证书管理",
                "appeditDeviceManager":"编辑设备",
                "appeditCredential":"编辑证书",
                "appevent":"事件管理",
                "appaddEvent":"添加事件",
                "appeditback":"事件管理",
                "appeventclassfamily":"事件组",
                "appeventclassfamilybasic":"基本信息",
                "appeventclassfamilyevent":"事件域",
                "appjumpeventclass":"事件表单",
                "appeditMonitoring":"编辑监控",
                "appchangepsd":"修改密码"
            },
            draw2dtipInfo: {
                "deleteModal": {
                    "ok": '确定',
                    "cancel": '取消',
                    "title": '删除',
                    "content": '确认删除吗？'
                },
                "tipModal": {
                    "title": '警告',
                    "content": '请检查输出点是否有连接'
                },
                "inputTip": {
                    "content": '请双击输入'
                }
            }

        }).directive('eChart', function($http, $window) {
            function link($scope, element, attrs) {
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs['eData'], function() {
                    var option = $scope.$eval(attrs.eData);
                    if (angular.isObject(option)) {
                        myChart.setOption(option);
                    }
                }, true);
                $scope.getDom = function() {
                    return {
                        'height': element[0].offsetHeight,
                        'width': element[0].offsetWidth
                    };
                };
                $scope.$watch($scope.getDom, function() {
                    // resize echarts图表
					myChart.resize();
                }, true);
            }
            return {
                restrict: 'A',
                link: link
            };
        }).directive('findWord',function(){
        	return {
        		restrict:'EA',
        		link:function(scope, element, attrs, tabsCtrl) { 
        			//console.log(element)
        			var keyWords=["abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "default", "do","double", "else", "enum", "extends", "false", "final", "finally", "float", "for", "goto", "if","implements", "import", "instanceof", "int", "interface", "long", "native", "new", "null", "package","private", "protected", "public", "return", "short", "static", "strictfp", "super", "switch","synchronized", "this", "throw", "throws", "transient", "true", "try", "void", "volatile", "while"]
			        var rep=/^[A-Za-z_$]+[a-zA-Z0-9_$]*$/;
			        element.on('input',function(){
			        	var oThisValue=this.value;		
	        			if(rep.test(oThisValue)){
	        				element.css({border:'1px solid #27c24c'})	
	        				for(var i=0; i<keyWords.length;i++){
			        			if(keyWords[i]==oThisValue ){
					        			element.css({border:'1px solid #f05050'});
					        			if(element.parent().parent().find('button')[0]){
					        				element.parent().parent().find('button')[0].disabled='disabled';
					        			}
					        			
				        			break;
				        		}else{
				        				element.css({border:'1px solid #27c24c'});
				        				if(element.parent().parent().find('button')[0]){
				        					element.parent().parent().find('button')[0].removeAttribute('disabled');
				        				}
					        			
				        		}
			        		}
	        			}else{
				        	element.css({border:'1px solid #f05050'});
				        	if(element.parent().parent().find('button')[0]){
				        		element.parent().parent().find('button')[0].disabled='disabled';
				        	}
				   			
	        			}
			        	
			        })
			        
			        
			     }
        	}
        }).directive('findParams',function(){
        	return {
        		restrict:'EA',
        		require:'?^ngModel',
        		link:function(scope, element, attrs, ctrl) { 
        			var keyWords=["abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "default", "do","double", "else", "enum", "extends", "false", "final", "finally", "float", "for", "goto", "if","implements", "import", "instanceof", "int", "interface", "long", "native", "new", "null", "package","private", "protected", "public", "return", "short", "static", "strictfp", "super", "switch","synchronized", "this", "throw", "throws", "transient", "true", "try", "void", "volatile", "while"]
			        var rep=/^[A-Za-z_$]+[a-zA-Z0-9_$]*$/;
        			ctrl.$validators.validCharacters = function(modelValue, viewValue) {
		                var value = modelValue || viewValue;
		                if(rep.test(value)){	
	        				for(var i=0; i<keyWords.length;i++){
			        			if(keyWords[i]==value ){
					        		return false;
				        			break;
				        		}
			        		}
	        				return true;
	        			}else{
				        	return false;
				   			
	        			}
		              
		            };
        		
			        
			        
			     }
        	}
        })
})();
