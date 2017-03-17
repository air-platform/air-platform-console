(function() {
	'use strict';
	angular.module('iot').controller('EventAndEventClassCtrl', EventAndEventClassCtrl);

	function EventAndEventClassCtrl($rootScope, $state,$scope, $stateParams, NetworkService, constdata, i18n,toastr,EventDataShareServer) {
		var vm = this;

		vm.isAddModel = $stateParams.args.isAddModel;
		$rootScope.isAddModel = vm.isAddModel;

		var eventId = $stateParams.eventId;
		EventDataShareServer.eventId = eventId;
		EventDataShareServer.navStepTitles = [{name:i18n.t('event.EVENT_FAMILY'),index:0}];
		EventDataShareServer.navStepIndex = 0;

		vm.hidenSubmitBtn = false;
		vm.selectedVersion = i18n.t('u.VERSION');
		vm.schemaVersions = [];



		vm.navStepTitles = EventDataShareServer.navStepTitles;


		vm.info = {};

		function getBasicInfo() {
			NetworkService.get(constdata.api.event.eventPath + '/' + eventId, null, function(response) {
				vm.info = response.data;
				vm.schemaVersions = vm.info.schemaVersions;//version
				vm.selectedVersion = vm.schemaVersions[0];
				if(vm.schemaVersions[0] && vm.schemaVersions[0].version) {
					$rootScope.selectedVersion = vm.schemaVersions[0].version;
				}
				if (vm.selectedVersion){
					getSchemaInfo(vm.selectedVersion.version);
					vm.isAddModel = false;
					$rootScope.isAddModel = vm.isAddModel;
				}else{
					vm.isAddModel = true;
					$rootScope.isAddModel = vm.isAddModel;
				}
			}, function(response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error(i18n.t('u.GET_DATA_FAILED') + vm.authError);
			});
		};
		function getSchemaInfo(version) {
			NetworkService.get(constdata.api.event.eventPath + '/' + eventId + '/schemas/v' + version, null, function(response) {
				var items = response.data;

				EventDataShareServer.eventClasses = [];

				for(var i = 0 ; i < items.length ; i++){
					var item = items[i];
					var schema = JSON.parse(item.schema);
					// console.log(item.fqn);
					var newItem = {
						// "namespace": item.fqn,
						"type": schema.type,
						"classType": item.type,
						"name": schema.name,
						"fields": schema.fields
					}
					EventDataShareServer.eventClasses.push(newItem);
				}

				$scope.$bus.publish({
					channel: 'RefreshChannel',
					topic: 'RefreshTopic',
					data: { /* 更新Event Classes列表 */ }
				});

			}, function(response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error(i18n.t('u.GET_DATA_FAILED') + vm.authError);
			});
		};
		

		vm.updateAction = function() {
			NetworkService.put(constdata.api.event.eventPath + '/' + eventId,vm.info, function(response) {
				vm.info = response.data;
				toastr.success(i18n.t('u.UPDATE_SUC'));
			}, function(response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
			});
		}

		// vm.submitAction = function () {
		// 	var params = removeHashKey(EventDataShareServer.eventClasses);

		// 	console.log(params);

		// 	if (vm.isAddModel){
		// 		NetworkService.post(constdata.api.event.eventPath + '/' + eventId + '/schemas',params, function(response) {
		// 			toastr.success('添加成功');
		// 			vm.cancelAction();
		// 		}, function(response) {
		// 			vm.authError = response.statusText + '(' + response.status + ')';
		// 			toastr.error('添加失败：' + vm.authError);
		// 		});
		// 	}else{
		// 		NetworkService.put(constdata.api.event.eventPath + '/' + eventId + '/schemas/v' + vm.selectedVersion.version,params, function(response) {
		// 			toastr.success('更新成功');
		// 			vm.cancelAction();
		// 		}, function(response) {
		// 			vm.authError = response.statusText + '(' + response.status + ')';
		// 			toastr.error('更新失败' + vm.authError);
		// 		});

		// 	}

		// };


		vm.selectedVersionChanged = function () {
			$rootScope.selectedVersion = vm.selectedVersion;
			EventDataShareServer.eventClasses = [];
			getSchemaInfo(vm.selectedVersion.version);
		};

		// function removeHashKey (obj) {return angular.copy(obj)}

		vm.cancelAction = function () {
			$state.go('app.event');
		};


		//订阅刷新页面
		// $scope.$bus.subscribe({
		// 	channel: 'refresh',
		// 	topic: 'step',
		// 	callback: function(data, envelope) {
		// 		vm.navStepTitles = EventDataShareServer.navStepTitles;
        //
		// 		if (vm.navStepTitles.length == 1){
		// 			vm.hidenSubmitBtn = false;
		// 		}else{
		// 			vm.hidenSubmitBtn = true;
		// 		}
		// 	}
		// });

		window.onhashchange=function(){
			// var url = window.location.href;

			vm.navStepTitles = EventDataShareServer.navStepTitles;

			if (vm.navStepTitles.length == 1){
				vm.hidenSubmitBtn = false;
			}else{
				vm.hidenSubmitBtn = true;
			}
		}


		vm.changeStepTo=function (item) {
			EventDataShareServer.navStepIndex = item.index;
			var shouldDeleteNum = EventDataShareServer.navStepTitles.length - item.index - 1;

			if (shouldDeleteNum > 0){
				EventDataShareServer.navStepTitles = EventDataShareServer.navStepTitles.splice(item.index,shouldDeleteNum);
			}

			vm.navStepTitles = EventDataShareServer.navStepTitles;
			if (vm.navStepTitles.length == 1){
				vm.hidenSubmitBtn = false;
			}else{
				vm.hidenSubmitBtn = true;
			}
			if (item.name == i18n.t('event.EVENT_FAMILY')){
				$state.go('app.eventclassfamily.basic');
			}
		};

		getBasicInfo();

	}
})();