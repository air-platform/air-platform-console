(function () {
	'use strict';
	
	angular.module('iot').controller('ApplicationDeployController', ApplicationDeployController);
	
	function ApplicationDeployController($state,$stateParams,constdata,NetworkService,toastr,i18n) {
		
		var vm = this;

		vm.info = {};
		vm.isAdd = true;
		vm.userTitle = i18n.t('application.ADD_APP');
		// vm.userVerifier = [{title:'默认',value:'default'},{title:'信任',value:'trustful'}];
		// vm.credentialsProvider = vm.userVerifier[0];

		var applicationName = $stateParams.applicationName;
        vm.applicationName = applicationName;
		if (applicationName){
			vm.userTitle = i18n.t('application.EDIT_APP');
			vm.isAdd = false;
		}

		// vm.selectedUVChanged = function () {
		// 	if (vm.credentialsProvider.title == '默认'){
		// 		vm.info.credentialsProvider = 'default';
		// 	}else{
		// 		vm.info.credentialsProvider = 'trustful';
		// 	}
		// }

		vm.amendUser = function(index) {
			$state.go('app.application');
		}

		vm.back = function () {
			$state.go('app.application');
		}

		vm.getData = function() {

			NetworkService.get(constdata.api.application.appsPath,null,function (response) {
				vm.info = response.data;
				// if (vm.info.credentialsProvider == 'default'){
				// 	vm.credentialsProvider = vm.userVerifier[0];
				// }else{
				// 	vm.credentialsProvider = vm.userVerifier[1];
				// }
				
			},function (response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error(i18n.t('application.GET_APP_INFO_FAILED'));
			});
		}

		function addItem() {
			// vm.info = {
			//   "name": "app1",
			//   "credentialsProvider": "default",
			//   "description": "My App Desc"
			// }
			vm.info.credentialsProvider = "default";
			console.log(vm.info);
			NetworkService.post(constdata.api.application.appsPath,vm.info,function (response) {
				toastr.success(i18n.t('u.ADD_SUC'));
				vm.backAction();
			},function (response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				console.log(vm.authError);
				toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
			});
		}

		function editItem() {
//			console.log(vm.info);
			NetworkService.put(constdata.api.application.appsPath + '/' + applicationName,vm.info,function (response) {
				toastr.success(i18n.t('u.UPDATE_SUC'));
				vm.backAction();
			},function (response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error(i18n.t('u.OPERATE_FAILED') + response.statusText);
			});
		}
		vm.submitAction = function () {
			if (vm.isAdd){
				addItem();
			}else{
				editItem();
			}
		}


		vm.backAction = function () {
			$state.go('app.application');
		}


		if (!vm.isAdd){
			vm.getData();
		}

	}
	
	
	
})();
