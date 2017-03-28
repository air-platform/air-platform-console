(function () {
	'use strict';
	
	angular.module('iot').controller('ApplicationEditController', ApplicationEditController);
	
	function ApplicationEditController($state,$stateParams,constdata,NetworkService,toastr,i18n) {
		
		var vm = this;

		vm.info = {};
		vm.isAdd = true;
		vm.userTitle = i18n.t('application.ADD_APP');
		// vm.userVerifier = [{title:'默认',value:'default'},{title:'信任',value:'trustful'}];
		// vm.credentialsProvider = vm.userVerifier[0];
		vm.allEnableService = new Array();
		vm.selService = '';
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


		vm.langOptions = ['Go', 'Javascript', 'Python'];
		vm.info.lang = 'Go';
		vm.info.servicesArr = [];//["cebdbdf9-c535-4fac-ac97-2ef8ac5f60a0", "d7332337-7b3e-4c4d-a03a-70802759b736"];
		vm.info.services = '';
		vm.amendUser = function(index) {
			$state.go('app.application');
		}

		vm.back = function () {
			$state.go('app.application');
		}
		vm.downloadSDK = function(index) {
			vm.info.services = vm.info.servicesArr.toString();
			console.log(vm.info.services);

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

		vm.getCloudService = function(){

			NetworkService.post(constdata.api.product.listAllPath,null,function (response) {
				vm.infos = response.data[0].userServices;
				vm.infosUser = response.data[1].userServices;
				// console.log( vm.infos);
				vm.displayedCollection = [].concat(vm.infos);
				vm.displayedUserCollection = [].concat(vm.infosUser);
				//$scope.sc = [].concat(vm.infos);
				//console.log(vm.infos);
				for(var i = 0;  i < vm.displayedCollection.length; i ++){
					if(vm.displayedCollection[i].api_key != ''){
						vm.allEnableService.push(vm.displayedCollection[i]);
					}
				}
				for(var i = 0;  i < vm.displayedUserCollection.length; i ++){
					if(vm.displayedUserCollection[i].api_key != ''){
						vm.allEnableService.push(vm.displayedUserCollection[i]);
					}
				}
				console.log(vm.allEnableService);

			},function (response) {
				toastr.error(response.statusText);
				console.log('Error');
				console.log('Status' + response.status);
			});

		}
		function addItem() {
			// vm.info = {
			//   "name": "app1",
			//   "credentialsProvider": "default",
			//   "description": "My App Desc"
			// }
			vm.info.credentialsProvider = "default";
			//console.log(vm.info);
			vm.info.services = vm.info.servicesArr.toString();
			console.log(vm.info.services);
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
		vm.getCloudService();

	}
	
	
	
})();
