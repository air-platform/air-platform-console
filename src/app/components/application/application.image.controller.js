(function () {
	'use strict';
	
	angular.module('iot').controller('ApplicationImageController', ApplicationImageController);
	/** @ngInject */
	function ApplicationImageController(NetworkService,constdata,$state,$stateParams,toastr,StorageService,$uibModal,$log,UserInfoServer,i18n, delmodaltip) {
		
		var vm = this;

		vm.info = {};
		vm.isAdd = true;
		vm.userTitle = i18n.t('application.ADD_APP');
		// vm.userVerifier = [{title:'默认',value:'default'},{title:'信任',value:'trustful'}];
		// vm.credentialsProvider = vm.userVerifier[0];

		var applicationName = $stateParams.applicationName;
		//console.log('ddddddd');
		//console.log($stateParams.args.selItem);
        vm.applicationName = applicationName;
		/*if (applicationName){
			vm.userTitle = i18n.t('application.EDIT_APP');
			vm.isAdd = false;
		}*/


		//console.log($stateParams);
		//vm.selItem = $stateParams.selItem;
		// vm.selectedUVChanged = function () {
		// 	if (vm.credentialsProvider.title == '默认'){
		// 		vm.info.credentialsProvider = 'default';
		// 	}else{
		// 		vm.info.credentialsProvider = 'trustful';
		// 	}
		// }
		//vm.info = vm.selItem;
		vm.appId = applicationName;
		console.log(vm.appId);

		vm.amendUser = function(index) {
			$state.go('app.application');
		}

		vm.back = function () {
			$state.go('app.application');
		}

		vm.getData = function() {

			NetworkService.get(constdata.api.application.appsPath + '/' + vm.appId,null,function (response) {
				vm.info = response.data.data;
				// if (vm.info.credentialsProvider == 'default'){
				// 	vm.credentialsProvider = vm.userVerifier[0];
				// }else{
				// 	vm.credentialsProvider = vm.userVerifier[1];
				// }
				//console.log(vm.info);
			},function (response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error(i18n.t('application.GET_APP_INFO_FAILED'));
			});
		}
		vm.getData();
		function addItem() {
			// vm.info = {
			//   "name": "app1",
			//   "credentialsProvider": "default",
			//   "description": "My App Desc"
			// }
			vm.info.credentialsProvider = "default";
			//console.log(vm.info);

			var img = {
				"name": "testabc",
				"tag": "1.0",
				"appId": "app123456",
				"lang": "go",
				"git": "http://223.202.32.60:8071/gk-test/testapp6.git"
			};


			img.name = vm.info.imageName;
			img.tag = 'latest';
			if(vm.info.imageTag != null && vm.info.imageTag != '') {
				img.tag = vm.info.imageTag;
			}
			img.appId = vm.info.id;
			img.lang = vm.info.lang;
			img.git = vm.info.git;




			NetworkService.post(constdata.api.application.imgsPath,img,function (response) {
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


		//if (!vm.isAdd){
		//	vm.getData();
		//}

	}
	
	
	
})();
