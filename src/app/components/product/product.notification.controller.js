(function() {
	'use strict';

	angular.module('iot').controller('ProductNotiCtrl', ProductNotiCtrl);

	/** @ngInject */
	function ProductNotiCtrl($state, $stateParams, NetworkService, constdata, $uibModal, $log, toastr, delmodaltip) {
		/* jshint validthis: true */
		var vm = this;
		var prodname;
		var argsProduct = {};
		var isSubBack = false;
		var subTopicList = [];
		var listToChoose = [];
		var isDefinedBack = false;
		var definedTopicList = [];

		vm.infos = [];
		vm.tipsInfo = delmodaltip;
		
		ifClickBrowserBackBtn();
		
		getNotificationDatas();
		
		vm.removeTopicAdded = function(size, index) {
			var modalInstance = $uibModal.open({
				templateUrl: 'myModalContent.html',
				size: size,
				controller: 'ModalInstanceCtrl',
				resolve: {
					tipsInfo: function() {
						return vm.tipsInfo;
					}
				}
			});
			modalInstance.result.then(function(param) {
				var nameOfDelPro = vm.infos[index].name;
				NetworkService.delete(constdata.api.product.getdevicegroup + '/' + prodname + '/devicegroup/topics' + '/' + nameOfDelPro, null, function(response) {
					getNotificationDatas();
					toastr.success('删除成功');
					//重置状态
					definedTopicList = [];
					subTopicList = [];
					listToChoose = [];
				}, function(response) {
					vm.authError = response.statusText + '(' + response.status + ')';
                	toastr.error('操作失败' + vm.authError);	
					console.log('Status' + response.status);
				});
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		}

		//打开模态窗口
		vm.openDgTopicAlert = function() {
			getDefinedTopicList();
			getSubscribedTopic();
			var timer = window.setInterval(function() {
				if(isDefinedBack && isSubBack) {
					clearInterval(timer);
					// console.log(definedTopicList);
					// console.log(subTopicList);
					listToChoose = getArrLeft(definedTopicList, subTopicList);
					// console.log(listToChoose);
					isDefinedBack = false;
					isSubBack = false;
					if(listToChoose.length == 0) {
						toastr.error('已经没有可订阅的主题，请先定义主题');
					} else {
						var modalInstance = $uibModal.open({
							templateUrl: 'myAddTopicModal.html',
							controller: 'DgTopicModalCtrl',
							controllerAs: 'vm',
							resolve: {
								tipsInfo: function() {
									return vm.tipsInfo;
								},
								prodnames: function() {
									return vm.prodname;
								},
								listToChoose: function() {
									return listToChoose;
								}
							}
						});
						modalInstance.result.then(function(param) {
							//重置状态
							definedTopicList = [];
							subTopicList = [];
							listToChoose = [];
							getNotificationDatas();
							
						}, function() {
							$log.info('Modal dismissed at: ' + new Date());
						});
					}
				}
			},20);
		}

		function hasNameAttr(obj){
            for (var name in obj){
                return false;
            }
            return true;
        };

		//找出剩余元素
		function getArrLeft(arrAll,arrPart) {
			// 把a数组转化成object 
			var hash = {}; 
			var arrDif = [];
			var arrSame = []; 
			for(var i=0,max=arrPart.length; i<max; i++) { 
				var obj = {}; 
				hash[arrPart[i]] = true; 
			} 
			// 通过hash检测b数组中的元素 
			for(var i=0, max=arrAll.length; i<max; i++) { 
				if(typeof hash[arrAll[i]] !== "undefined") { 
					//相同元素
					arrSame.push(arrAll[i]);
				} else { 
					// 不同元素 
					arrDif.push(arrAll[i]);
				} 
			}
			return arrDif;
		}

		function getSubscribedTopic() {
			NetworkService.get(constdata.api.product.topicListAllPath + '/' + prodname + '/devicegroup/topics', null, function(response) {
				vm.backSubData = response.data;
				for(var i=0; i<vm.backSubData.length; i++) {
					subTopicList.push(vm.backSubData[i].name);
				}
				// console.log(subTopicList);
				isSubBack = true;
			}, function(response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error('获取数据失败' + response.status + ' ' + response.statusText);
				console.log('Error');
				console.log('Status' + response.status);
			});
			
		}

		function ifClickBrowserBackBtn() {
        	if(hasNameAttr($stateParams.args)) {
            	//浏览器回退按钮加载的本页面
	            argsProduct = JSON.parse( sessionStorage.getItem('sessionStoredProduct') ).product;
	            prodname = argsProduct.name;
	            vm.prodname = argsProduct.name;
	        } else {
	            //路由跳转加载的，要本地存储
	            argsProduct = $stateParams.args;
	            prodname = argsProduct.name;
	            vm.prodname = argsProduct.name;
	        }
        }

        function getNotificationDatas() {
			NetworkService.get(constdata.api.product.getdevicegroup + '/' + prodname + '/devicegroup/topics', null, function(response) {
				vm.infos = response.data;
				// console.log(vm.infos);
			}, function(response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error('获取数据失败' + response.status + ' ' + response.statusText);
				console.log('Error');
				console.log('Status' + response.status);
			});
		}

		//获取定义了的主题信息
		function getDefinedTopicList() {
			NetworkService.get(constdata.api.product.topicListAllPath + '/' + prodname + '/topics', null, function(response) {
				vm.backDefinedData = response.data.content;
				// console.log(vm.backDefinedData[0].name);
				definedTopicList = [];
				if(vm.backDefinedData.length == 0) {
					;
				} else {
					for(var i=0; i<vm.backDefinedData.length; i++) {
						definedTopicList.push(vm.backDefinedData[i].name);
					}
				}
				// console.log(definedTopicList);
				isDefinedBack = true;
			}, function(response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error('获取数据失败' + response.status + ' ' + response.statusText);
				console.log('Error');
				console.log('Status' + response.status);
			});
		}

	}

})();