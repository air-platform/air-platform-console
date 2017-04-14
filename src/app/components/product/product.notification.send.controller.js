(function() {
	'user strict';

	angular.module('iot').controller('ProductSendNotification', ProductSendNotification);

	/** @ngInject */
	function ProductSendNotification($scope, $state, $stateParams, $http, toastr, constdata, StorageService, NetworkService, Restangular, RestService) {
		 /* jshint validthis: true */
		var vm = this;
		//参数来自productTopic.controller.js
		var pName = $stateParams.args.product.name;
		var topicName = $stateParams.args.topic.name;

		getSdkInfo();
		//获取定义的通知信息
        vm.myNotiData = [];
        vm.selectedEnums = [];
        vm.isChecked = [];
        vm.otherfield = [];
        vm.dateOptions = {
          formatYear: 'yy',
          startingDay: 1,
          class: 'datepicker'
        };
        vm.initDate = new Date('2016-15-20');
        vm.formats = ['MM/dd/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        vm.format = vm.formats[0];
        
        //每次选择不同版本请求不同数据
		vm.change = function() {
            vm.notificationDatas = [];
            getNotiData(vm.selectedOption);
		}

		// date picker
		vm.today = function() {
	      vm.dt = new Date();
	    };
	    vm.today();

	    vm.clear = function () {
	      vm.dt = null;
	    };

	    // Disable weekend selection
	    vm.disabled = function(date, mode) {
	      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	    };

	    vm.toggleMin = function() {
	      vm.minDate = new Date();
	    };
	    vm.toggleMin();

	    vm.open = function($event) {
	      $event.preventDefault();
	      $event.stopPropagation();

	      vm.opened = true;
	    };









		// end of date picker
        //监听输入数字最大值
        vm.isNumberValid = [];
        vm.watchValue = function(type,val,index) {
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
        }
		//发送topic
		vm.sendNotification = function() {
            //字段相关数据
            vm.fields = '';
            for(var i=0; i<vm.notificationDatas.length; i++) {
                if(vm.notificationDatas[i].type.name) {
                    var name = vm.notificationDatas[i].name;
                    var value = vm.selectedEnums[i].sel;
                    var obj = '\"' + name + '\":' + '\"' + value + '\",';
                    vm.fields+=obj;
                } else if(vm.notificationDatas[i].type=='boolean') {
                    var name = vm.notificationDatas[i].name;
                    var value = vm.isChecked[i].isCheck;
                    var obj = '\"' + name + '\":' + value + ',';
                    vm.fields+=obj;
                } else if(vm.notificationDatas[i].type=='float' || vm.notificationDatas[i].type=='double' || vm.notificationDatas[i].type=='long' || vm.notificationDatas[i].type=='int'){
                    var name = vm.notificationDatas[i].name;
                    var value = vm.otherfield[i].input;
                    var obj = '\"' + name + '\":' + value + ',';
                    vm.fields+=obj;
                } else {
                    var name = vm.notificationDatas[i].name;
                    var value = vm.otherfield[i].input;
                    var obj = '\"' + name + '\":' + '\"' + value + '\",';
                    vm.fields+=obj;
                }
            }
            //去最后一个逗号
            vm.fields = vm.fields.substring(0, vm.fields.length-1);
            vm.fields = JSON.parse('{'+vm.fields+'}');
            //发送数据
			vm.sendUser = 'user';
			vm.sendDate = vm.dt;
            vm.sendBody = JSON.stringify(vm.fields);
			vm.sendData = {
				"type": vm.sendUser,
				"date" : (vm.dt).getTime(),
				"body": vm.sendBody
			}
			// console.log(vm.sendData);
            NetworkService.post(constdata.api.product.sendNotiTopicPath + pName + '&topic=' + topicName + '&profileVersion=v' + vm.selectedOption,vm.sendData, function(response) {
                //重置数据
                vm.myNotiData = [];
                vm.selectedEnums = [];
                vm.ischecked = [];
                vm.otherfield = [];
                vm.isNumberValid = [];
                toastr.success('发送成功');
                $state.go('app.productTab.productTopic',{args: $stateParams.args.product});
            }, function(response) {
                console.log(response);
                toastr.error('添加失败：' + response.status + ' ' + response.statusText);
            });

		}
		//取消发送
		vm.cancelSend = function() {
			$state.go('app.productTab.productTopic',{args: $stateParams.args.product});
		}

        //获取sdk信息
        function getSdkInfo() {
            NetworkService.get(constdata.api.product.productInfoPath + '/' + pName + '/profiles',null,function (response) {
                vm.sdks = response.data.content;
                // console.log(vm.sdks);
                vm.sdkVersionList = [];
                for(var i=0; i<vm.sdks.length; i++) {
                    vm.sdkVersionList[i] = {ver: vm.sdks[i].version, list : vm.sdks[i].name + " (v" + vm.sdks[i].version + ")"};
                }
                // console.log(vm.sdkVersionList);
                //默认选中第一个版本
                vm.selectedOption = vm.sdks[0].version;
                getNotiData(vm.sdks[0].version);
                vm.options = {
                    hstep: vm.sdkVersionList
                };
            },function (response) {
                toastr.error("获取失败：" + response.statusText);
                console.log('Error');
                console.log('Status' + response.status);
            });
        }

        function getNotiData(version) {
            NetworkService.get(constdata.api.product.notificationInfoPath+'/'+pName+'/profiles/v'+ version +'/schemas/notification',null,function (response) {
                var watcher = $scope.$watch('vm.notificationInfo',function(newValue, oldValue) {
                    if(oldValue!=newValue) {
                        vm.isReady = true;
                        watcher();
                    }
                }, true);
                vm.notificationInfo = JSON.parse(response.data.schema);
                // console.log(vm.notificationInfo);
                vm.notificationDatas = vm.notificationInfo.fields;
                // console.log(response.data.schema);
                for(var i=0; i<vm.notificationDatas.length; i++) {
                    vm.myNotiData[i] = vm.notificationDatas[i].type;
                    if(typeof(vm.notificationDatas[i].type) == 'object') {
                        var notiEnumArr = vm.notificationDatas[i].type.symbols;
                        vm.myNotiData[i] = 'enum';
                        vm.selectedEnums[i] = {sel : vm.notificationDatas[i].type.symbols[0]}
                    }
                    else if(vm.notificationDatas[i].type=='boolean') {
                        vm.isChecked[i] = {isCheck : true}
                    } else {
                        vm.otherfield[i] = {input : vm.notificationDatas[i].default}
                    }
                }
                for(var i=0; i<vm.otherfield.length; i++) {
                    vm.isNumberValid[i] = true;
                }
            },function (response) {
                toastr.error(response.statusText);
                console.log('Error');
                console.log('Status' + response.status);
            });
        }


	}
})();