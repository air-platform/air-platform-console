(function () {
	'use strict';
	
	angular.module('iot').controller('ApplicationDeployController', ApplicationDeployController);
	
	function ApplicationDeployController($state,$stateParams,constdata,NetworkService,toastr,i18n) {
		
		var vm = this;

		vm.info = {};
		vm.SvcInfo = {};
		vm.RcInfo = {};
		vm.isAdd = true;
		vm.userTitle = i18n.t('application.ADD_APP');
		// vm.userVerifier = [{title:'默认',value:'default'},{title:'信任',value:'trustful'}];
		// vm.credentialsProvider = vm.userVerifier[0];
		vm.imgArr = new Array();
		vm.selImg = '';
		var applicationName = $stateParams.applicationName;
        vm.applicationName = applicationName;
		vm.appId = applicationName;
		/*if (applicationName){
			vm.userTitle = i18n.t('application.EDIT_APP');
			vm.isAdd = false;
		}*/

		// vm.selectedUVChanged = function () {
		// 	if (vm.credentialsProvider.title == '默认'){
		// 		vm.info.credentialsProvider = 'default';
		// 	}else{
		// 		vm.info.credentialsProvider = 'trustful';
		// 	}
		// }

		vm.userVerifier = [
			{
				title:'验证',
				value:'default'
			},
			{
				title:'信任',
				value:'trustful'
			}
		];
		vm.platOptions = {
			plat : [
				{val:'android',name:'Android'},
				{val:'objc',name:'iOS'},
				{val:'java',name:'Java'},
				{val:'c',name:'C'}
			]
		};





		vm.platform = 'android';
		vm.downLoadOptions = [
			{
				name : "Android",
				value : 'android'
			},
			{
				name : "iOS",
				value : "objc"
			},
			{
				name : i18n.t('application.DESKTOP'),
				value : "java"
			}
		];


		vm.downloadSDK = function(index) {
			 console.log(index);
			//var token = StorageService.get('iot.hnair.cloud.access_token');
			//var downloadUrl = BASE_API_URL + 'products/' + vm.argsProduct.name + '/profiles/v' + vm.sdks[index].version + '/sdk?platform=' + vm.sdks[index].plat + '&token=' + token;
			//downloadFile(downloadUrl);
		}

		vm.amendUser = function(index) {
			$state.go('app.application');
		}

		vm.back = function () {
			$state.go('app.application');
		}

		/*vm.getData = function() {

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
		}*/

		vm.getData = function() {

			NetworkService.get(constdata.api.application.appsPath + '/' + vm.appId,null,function (response) {
				vm.info = response.data.data;
				// if (vm.info.credentialsProvider == 'default'){
				// 	vm.credentialsProvider = vm.userVerifier[0];
				// }else{
				// 	vm.credentialsProvider = vm.userVerifier[1];
				// }
				console.log(vm.info);
			},function (response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error(i18n.t('application.GET_APP_INFO_FAILED'));
			});




			NetworkService.get(constdata.api.application.imgsAppPath + '/' + vm.appId + '/images',null,function (response) {



				console.log(response.data);
				console.log(response.data.length);
				vm.info.imgInfo = response.data[2];
				// vm.originDes = vm.info.description;
				//vm.choosedVerify.val = vm.info.verifierToken;
				//console.log(vm.info.imgInfo);
				console.log(vm.info.imgInfo);


				for(var i = 0; i < response.data.length; i ++)
				{
					vm.imgArr.push(response.data[i].img);
				}
				console.log(vm.imgArr);
				if(vm.imgArr.length > 0){
					vm.selImg = vm.imgArr[0];
				}

				/*for (var x in vm.info.imgInfo)
				{
					//document.write(mycars[x] + "<br />")
					vm.imgArr.push(x.img);
				}

				console.log(vm.imgArr);*/

			},function (response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error(vm.authError);
			});






		}
		vm.getData();
		/*function addItem() {
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
		}*/




		function addItem() {

			//console.log(vm.info);

			var svcTmp = {
				"kind": "Service",
				"apiVersion": "v1",
				"metadata": {
					"name": "myweb",
					"namespace": "default"
				},
				"spec": {
					"type": "NodePort",
					"ports": [
						{
							"port": 8080
						}
					],
					"selector": {
						"app": "myweb"
					}
				}
			};







			var rcTmp = {
				"kind": "ReplicationController",
				"apiVersion": "v1",
				"metadata": {
				"name": "myweb",
					"namespace": "default"
				},
				"spec": {
				"replicas": 1,
					"selector": {"app":"myweb"},
				"template": {
					"metadata": {
						"labels": {"app":"myweb"}
					},
					"spec": {
						"containers": [{
							"name": "myweb",
							"image": "hub.c.163.com/allan1991/tomcat-app:v1",
							"ports": [{
								"containerPort": 8080
							}],
							"env": [{
								"name": "TEST_ENV",
								"value": "123456"
							}],
							"imagePullPolicy": "IfNotPresent"
						}],
							"restartPolicy": "Always"
					}
				}
				}
			};












			svcTmp.spec.ports[0].port = parseInt(vm.SvcInfo.ports);
			svcTmp.spec.selector.app = vm.info.name;
			svcTmp.metadata.name = vm.info.name;
			svcTmp.metadata.namespace = vm.info.user;
			console.log(svcTmp);



			//rcTmp.spec.replicas = 1;
			rcTmp.metadata.name = vm.info.name;
			rcTmp.metadata.namespace = vm.info.user;
			rcTmp.spec.selector.app = vm.info.name;
			rcTmp.spec.template.metadata.labels.app = vm.info.name;
			rcTmp.spec.template.spec.containers[0].name = vm.info.name;
			rcTmp.spec.template.spec.containers[0].image = vm.selImg;//'hub.c.163.com/allan1991/tomcat-app:v1';
			rcTmp.spec.template.spec.containers[0].ports[0].containerPort = parseInt(vm.SvcInfo.ports);



			console.log(rcTmp);


						//return;
			NetworkService.post(constdata.api.application.depPath+'/rc',rcTmp,function (response) {
				toastr.success(i18n.t('u.ADD_SUC'));
				vm.backAction();
			},function (response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				console.log(vm.authError);
				toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
			});



			NetworkService.post(constdata.api.application.depPath+'/service',svcTmp,function (response) {
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


		/*if (!vm.isAdd){
			vm.getData();
		}*/

	}
	
	
	
})();
