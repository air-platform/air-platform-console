(function() {
	'use strict';
	angular.module('iot').controller('EventClassAddCtrl', EventClassAddCtrl);

	function EventClassAddCtrl($stateParams, $rootScope, $log, $scope, $state, $uibModal, toastr,EventDataShareServer,constdata,NetworkService,i18n, delmodaltip) {
		var vm = this;
		vm.isAdd = false;
		//保存按钮是否可用
		// $rootScope.isEvClassDataChanged = false;

		var eventId = $stateParams.eventId;
		if($stateParams.args && $stateParams.args.isAdd) {
			vm.isAdd = $stateParams.args.isAdd;
		}
		// console.log(vm.isAdd);
		//订阅刷新
		$scope.$bus.subscribe({
			channel: 'RefreshChannel',
			topic: 'RefreshTopic',
			callback: function(data, envelope) {
				vm.classItems = EventDataShareServer.eventClasses;
				// var eventClassesCopy = vm.classItems;
				// console.log('Refreshing');
				// console.log(eventClassesCopy);
			}
		});


		vm.classItems = EventDataShareServer.eventClasses;
		// console.log(vm.classItems);
		vm.deleteItem = function(item) {
			var index = vm.classItems.indexOf(item);
			vm.classItems.splice(index, 1);
			toastr.success(i18n.t('u.DELETE_SUC'), 'success');
			$rootScope.isEvClassDataChanged = true;
		};

		vm.tipsInfo = delmodaltip;
		vm.deleteEventClass = function(size, model) {
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
				vm.deleteItem(model);
			}, function() {
				$log.info('Modal dismissed at: ' + new Date());
			});
		}
		
		vm.editEventClassAction = function (item) {
			$rootScope.isEvClassDataChanged = true;
			var isAdd = true;
			var index = EventDataShareServer.eventClasses.indexOf(item);
			EventDataShareServer.isEditMode = index;
			EventDataShareServer.eventClass = item;

			refreshNavStepTitle(i18n.t('u.EDIT'));
			$state.go('app.eventclassfamily.event',{args:{isAdd:isAdd}});

		}

		vm.addNewClass = function () {
			$rootScope.isEvClassDataChanged = true;
			var isAdd = true;
			console.log('===');
			//初始化EventClass
			EventDataShareServer.isEditMode = -1;
			EventDataShareServer.eventClass = {
				// "namespace":EventDataShareServer.namespace,
				"type": "record",
				"classType": "event",
				"name": "",
				"fields": []
				// ,
				// "symbols":[]
			};

			refreshNavStepTitle(i18n.t('u.ADD'));
			$state.go('app.eventclassfamily.event',{args:{isAdd:isAdd}});

		}


		vm.shouldUpperCase = function (v) {
			return v.replace(/(\w)/,function(v){return v.toUpperCase()});
		}


		function refreshNavStepTitle(title) {
			EventDataShareServer.navStepIndex = EventDataShareServer.navStepIndex + 1;
			EventDataShareServer.navStepTitles.push({name:title,index:EventDataShareServer.navStepIndex});
			$scope.$bus.publish({
				channel: 'refresh',
				topic: 'step',
				data: { /* order info */ }
			});
		}
		//提交事件
		//首先判断class数组有没有变化决定保存按钮是否可用
		var eventClassesArr = EventDataShareServer.eventClasses;
		vm.submitAction = function () {
			var params = removeHashKey(EventDataShareServer.eventClasses);
			// console.log(EventDataShareServer.eventClasses);
			// console.log(params);

			if ($rootScope.isAddModel){
				NetworkService.post(constdata.api.event.eventPath + '/' + eventId + '/schemas',params, function(response) {
					toastr.success(i18n.t('u.ADD_SUC'));
					$rootScope.isEvClassDataChanged = false;
				}, function(response) {
					vm.authError = response.statusText + '(' + response.status + ')';
					toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
				});
			}else{
				NetworkService.put(constdata.api.event.eventPath + '/' + eventId + '/schemas/v' + $rootScope.selectedVersion,params, function(response) {
					toastr.success(i18n.t('u.UPDATE_SUC'));
					$rootScope.isEvClassDataChanged = false;
				}, function(response) {
					vm.authError = response.statusText + '(' + response.status + ')';
					toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
				});

			}

		};
		function removeHashKey (obj) {return angular.copy(obj)}
	}
})();