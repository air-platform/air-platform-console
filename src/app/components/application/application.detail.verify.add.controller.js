(function() {
	'user strict';

	angular.module('iot').controller('UserCheckAddCtrl', UserCheckAddCtrl)
    .filter('fieldNameTranslate', function() {
        return function(input) {
            var out = '';
            if(input=='verifyUrl') {
                out = '验证地址'
            } else if(input=='userId') {
                out = '用户标识属性'
            } else if(input=='userIdParam') {
                out = '用户标识参数'
            } else if(input=='accessTokenParam') {
                out = '访问密钥参数'
            } else if(input=='errorCode') {
                out = '错误码参数'
            } else if(input=='errorMessage') {
                out = '错误消息参数'
            } else if(input=='connectionTimeout') {
                out = '连接超时'
            } else if(input=='maxParallelConnections') {
                out = '最大连接并发数'
            }
            return out;
        }
    })
    .directive('showTip',function() {
        return {
            restrict : 'AE',
            scope : {
                name : '=value'
            },
            link : function(scope,ele,attr) {
                if(scope.name == 'verifyUrl') {
                    scope.tip = '验证服务器的地址，例如：http://www.mycompany.com/auth'
                } else if (scope.name == 'userId') {
                    scope.tip = '服务器验证成功后的返回的用户标识JSON属性,例如：userId'
                } else if (scope.name == 'userIdParam') {
                    scope.tip = '传递给验证服务器的用户标识参数,例如：userId'
                } else if (scope.name == 'accessTokenParam') {
                    scope.tip = '传递给验证服务器的访问密钥参数,例如：accessToken'
                } else if (scope.name == 'errorCode') {
                    scope.tip = '服务器验证失败的返回的错误码JSON属性,例如：errorCode'
                } else if (scope.name == 'errorMessage') {
                    scope.tip = '服务器验证失败的返回的错误信息JSON属性,例如：errorMessage'
                } else if (scope.name == 'connectionTimeout') {
                    scope.tip = '验证服务的连接超时（单位：秒),例如：60'
                } else if (scope.name == 'maxParallelConnections') {
                    scope.tip = '最大连接并发数，验证服务的最大连接并发数,例如：10'
                }
            },
            template : '{{tip}}'
        }
    });

	/** @ngInject */
	function UserCheckAddCtrl($state, $stateParams, toastr, constdata, NetworkService, i18n) {
		 /* jshint validthis: true */
		var vm = this;

        var isAdd = $stateParams.args.isAdd;
        vm.isAdd = isAdd;
		var appName = $stateParams.args.appName;
        var index = $stateParams.args.tabSelectedIndex;
        var appId = $stateParams.args.appId;
        var verifyType = $stateParams.args.verifyType;
        vm.verifyType = verifyType;
        // console.log(appId);
        
        vm.options = [];
        vm.fields = [];
        vm.editField = [];
        //获取类型数据
        function getVerifiesData() {
            NetworkService.get(constdata.api.plugin + 'userverifiers',null,function (response) {
                
                vm.verifiesDatas = response.data;
                vm.verifiesDatasAll = response.data;

                // console.log(response.data);
                //初始化数据
                if(isAdd) {
                    vm.btnTitle = 'product.ADD';
                    vm.selName = 'trustful';
                    vm.sendData = {
                        type: vm.selName,
                        displayName: "",
                        configuration: "{}",
                        description: ""
                    }
                } else {
                    vm.btnTitle = 'application.MODIFY';
                    vm.fields = [];
                    for(var i=0; i<response.data.length; i++) {
                        if(response.data[i].type == vm.verifyType) {
                            vm.fields = JSON.parse(response.data[i].configSchema).fields;
                            for(var j=0; j<vm.fields.length; j++) {
                                vm.isNumberValid[j] = true;
                            }
                        }
                    }
                    // console.log(vm.verifiesDatasAll);
                    function getVerifyInfoById(id) {
                        vm.configArr = [];
                        vm.valArr = [];
                        // console.log(vm.info.id);
                        NetworkService.get(constdata.api.application.appsPath + '/' + appName + '/userverifiers/' + id,null,function (response) {
                            vm.verifiesDatas = response.data;
                            // console.log(vm.verifiesDatas);

                            vm.selName = vm.verifiesDatas.type;
                            vm.sendData = {
                                name: vm.verifiesDatas.type,
                                displayName: vm.verifiesDatas.displayName,
                                configuration: vm.verifiesDatas.configSchema,
                                description: vm.verifiesDatas.description
                            }
                            

                            var configObj = ( JSON.parse(response.data.configuration) );
                            
                            for(var i=0; i<vm.verifiesDatasAll.length; i++) {
                                if(vm.verifiesDatasAll[i].type == verifyType) {
                                    var myField = JSON.parse(vm.verifiesDatasAll[i].configSchema).fields;
                                }
                            }
                            // console.log(myField);
                            for(var key in configObj) {
                                vm.valArr.push(configObj[key]);
                            }
                            for(var j=0; j<myField.length; j++) {
                                vm.configArr[j] = vm.valArr[j];

                            }
                            
                        },function (response) {
                            vm.authError = response.statusText + '(' + response.status + ')';
                            toastr.error(vm.authError);
                        });

                    }
                    getVerifyInfoById(appId);
                }
                // console.log(response.data.length);
                for(var i=0; i<vm.verifiesDatas.length; i++) {
                    var obj = {};
                    obj.val = response.data[i].type;
                    if(response.data[i].type=='rest') {
                        obj.show = i18n.t('application.REST');
                        // obj.show = getTranslateValue('application.REST');
                        // obj.show = $translate('application.REST');
                        vm.options.push(obj);
                    }
                    if(response.data[i].type=='trustful') {
                        obj.show = i18n.t('application.TRUSTFUL');
                        // obj.show = getTranslateValue('application.TRUST');
                        vm.options.push(obj);
                    }
                }
                
                // vm.selName = vm.options[0].type
            },function (response) {
                vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
                console.log('Error');
                console.log('Status' + response.status);
            });
        }
        getVerifiesData();
        
        vm.isNumberValid = [];
        vm.watchValue = function(type,val,index) {
           // console.log(index);
            vm.isNumberValid[index] = true;
            var value = Number(val);
            if(type=='int') {
                if(val>65535 || val<-65536) {
                    vm.isNumberValid[index] = false;
                } else {
                    vm.isNumberValid[index] = true;
                }
            } else if(type=='long') {
                if(val>2147483647 || val<-2147483648) {
                    vm.isNumberValid[index] = false;
                } else {
                    vm.isNumberValid[index] = true;
                }
            }
            // console.log(vm.isNumberValid);
        }
        //change
        vm.change = function() {
            // console.log(vm.selName);
            getFields();
        }
        function getFields() {
            for(var i=0;i<vm.verifiesDatas.length; i++) {
                if(vm.selName == vm.verifiesDatas[i].type) {
                    vm.fields = JSON.parse(vm.verifiesDatas[i].configSchema).fields;
                }
            }
            // console.log(vm.fields.length);
            // 创建独立的绑定空间
            if(vm.fields.length==0) {
                ;
            } else {
                vm.configArr = [];
                for(var j=0; j<vm.fields.length; j++) {
                    vm.isNumberValid[j] = true;
                    if(vm.fields[j].default) {
                        vm.configArr[j] = vm.fields[j].default;
                    } else if(isAdd) {
                        vm.configArr[j] = '';
                    } else {
                        for(var key in JSON.parse(vm.verifiesDatas.configuration)) {
                            vm.configArr[i] = vm.verifiesDatas[key];
                            
                        }
                    }
                }
            }
        }
        //保存
        vm.sendStr = '';
		vm.saveCheckInfo = function () {
            if(vm.fields.length==0) {
                vm.sendingData = {
                    "type": vm.sendData.type,
                    "displayName": vm.sendData.displayName,
                    "configuration": "{}",
                    "description": vm.sendData.description
                }
            } else {
                for(var j=0; j<vm.fields.length; j++) {
                    if(vm.fields[j].type.type=="string"||vm.fields[j].type.type=="bytes"){
                        var obj = '\"' + vm.fields[j].name + '\":' + '\"' + vm.configArr[j] + '\",';
                        vm.sendStr+=obj;
                    } else if(vm.fields[j].type.type=='float' || vm.fields[j].type.type=='double' || vm.fields[j].type.type=='long' || vm.fields[j].type.type=='int'){
                        var obj = '\"' + vm.fields[j].name + '\":' + Number(vm.configArr[j]) + ',';
                        vm.sendStr+=obj;
                    } else if(vm.fields[j].type.type=='boolean') {
                        var obj = '\"' + vm.fields[j].name + '\":' + vm.configArr[j] + ',';
                        vm.sendStr+=obj;
                    } else if(vm.fields[j].type.type=='enum') {
                        var obj = '\"' + vm.fields[j].name + '\":' + vm.configArr[j] + ',';
                        vm.sendStr+=obj;
                    } else {
                        var obj = '\"' + vm.fields[j].name + '\":' + vm.configArr[j] + ',';
                        vm.sendStr+=obj;
                    }
                }
                vm.sendStr = vm.sendStr.substring(0, vm.sendStr.length-1);
                vm.sendStr = JSON.parse('{'+vm.sendStr+'}');
                 // console.log(JSON.stringify(vm.sendStr));
                vm.sendingData = {
                    "type": vm.selName,
                    "displayName": vm.sendData.displayName,
                    "configuration": JSON.stringify(vm.sendStr),
                    "description": vm.sendData.description
                }
            }
            
            if(isAdd) {
                console.log(vm.sendingData);
                NetworkService.post(constdata.api.application.appsPath + '/' + appName + '/userverifiers',vm.sendingData,function (response) {
                    toastr.success(i18n.t('u.ADD_SUC'));
                    vm.fields = [];
                    $state.go('app.applicationDetail.verify',{applicationName:appName,args:{tabSelectedIndex:2}});
                },function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(vm.authError);
                    console.log('Status' + response.status);
                });
            } else {
                vm.sendingData = {
                    "displayName": vm.sendData.displayName,
                    "configuration": JSON.stringify(vm.sendStr),
                    "description": vm.sendData.description
                }
                // console.log(vm.sendingData);
                NetworkService.put(constdata.api.application.appsPath + '/' + appName + '/userverifiers/'+appId,vm.sendingData,function (response) {
                    toastr.success(i18n.t('u.CHANGE_SUC'));
                    vm.fields = [];
                    $state.go('app.applicationDetail.verify',{applicationName:appName,args:{tabSelectedIndex:2}});
                },function (response) {
                    vm.authError = response.statusText + '(' + response.status + ')';
                    toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
                    console.log('Status' + response.status);
                });
            }
			
		}

		//取消添加
		vm.cancelAdd = function() {
			$state.go('app.applicationDetail.verify',{applicationName:appName,args:{tabSelectedIndex:2}});
		}
	}
})();
