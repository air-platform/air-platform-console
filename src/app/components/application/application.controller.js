(function () {
    'use strict';

    angular
		.module('iot')
		.controller('ApplicationController', ApplicationController);
    
    /** @ngInject */
    function ApplicationController(NetworkService, constdata, $http, $state,$uibModal,$log,toastr,UserInfoServer,i18n, delmodaltip) {
        /* jshint validthis: true */
        var vm = this;

		vm.pageCurrent = 1;
		vm.pagePreEnabled = false;
		vm.pageNextEnabled = false;
		vm.totalPages = 12;
		vm.pages = [];
      	vm.infoTitle = {
			"token": i18n.t('application.ONLYINDEX'),
			"name": i18n.t('u.NAME'),
			"owner": i18n.t('u.OWNER'),
			"credentialsProvider": i18n.t('u.VMODE'),
			"created": i18n.t('u.CREATER'),
			"date": i18n.t('u.CREATEDATE'),
			"aID":"id"
		};

		vm.addNew = addNew;
		vm.deleteItem = deleteItem;
		vm.editItem = editItem;
		vm.goDetail = goDetail;

		vm.showOther = true;
		vm.showDeploy = true;

		vm.OperApp = OperApp;
		getDatas();
		vm.infos = [];
		vm.runInfosBasic = [];
		vm.runInfosBasicMap= {};
		vm.runInfosDetail = [];
		vm.userName = '';

		function getDatas() {
			vm.infos = [];
			vm.runInfosBasic = [];
			vm.runInfosBasicMap= {};
			vm.runInfosDetail = [];
            NetworkService.get(constdata.api.application.appsPath,{page:vm.pageCurrent},function (response) {
				vm.infos = response.data;
				console.log('get app  info success.');







				//if get service , to get run info
				if(vm.infos.length > 0){







					for(var i = 0; i < vm.infos.length; i ++){

							if(vm.infos[i].state == 'created'){
								vm.infos[i].isImageEnable = true;
								vm.infos[i].isDeployEnable = true;
								vm.infos[i].isStartEnable = false;
								vm.infos[i].isStopEnable = false;
								vm.infos[i].isRestartEnable = false;
								vm.infos[i].isDeleteEnable = false;
							}else if(vm.infos[i].state == 'Running'){
								vm.infos[i].isImageEnable = true;
								vm.infos[i].isDeployEnable = false;
								vm.infos[i].isStartEnable = false;
								vm.infos[i].isStopEnable = true;
								vm.infos[i].isRestartEnable = true;
								vm.infos[i].isDeleteEnable = true;
							}else if(vm.infos[i].state == 'Stopped'){
								vm.infos[i].isImageEnable = true;
								vm.infos[i].isDeployEnable = false;
								vm.infos[i].isStartEnable = true;
								vm.infos[i].isStopEnable = false;
								vm.infos[i].isRestartEnable = false;
								vm.infos[i].isDeleteEnable = true;
							}else if(vm.infos[i].state == 'Pending'){
								vm.infos[i].isImageEnable = true;
								vm.infos[i].isDeployEnable = false;
								vm.infos[i].isStartEnable = false;
								vm.infos[i].isStopEnable = false;
								vm.infos[i].isRestartEnable = false;
								vm.infos[i].isDeleteEnable = true;
							}

					}

					//first get all running apps, then get detail info for an app.
					NetworkService.get(constdata.api.application.depPath+'/app?namespace='+vm.infos[0].user,'', function (response) {
						var runInfoTmp = response.data;
						//toastr.success(i18n.t('u.ADD_SUC'));
						console.log(runInfoTmp);
						console.log('get basic run info success.');
						if(runInfoTmp != null && runInfoTmp.length > 0) {





							for (var i = 0; i < runInfoTmp.length; i++) {
								vm.runInfosBasicMap[runInfoTmp[i].name]= runInfoTmp[i].status;















							}


							for (var i = 0; i < runInfoTmp.length; i++) {
								vm.runInfosBasic.push(runInfoTmp[i]);

								var curName = vm.runInfosBasic[i].name;
								vm.userName = vm.infos[0].user;
								var curStatus = vm.runInfosBasic[i].status;
								NetworkService.get(constdata.api.application.depPath + '/app/' + curName + '?namespace=' + vm.infos[0].user, '', function (response) {
									var runInfoTmp = response.data;
									//toastr.success(i18n.t('u.ADD_SUC'));
									console.log('get detail run info success.');
									//console.log
									/*if(runInfoTmp.length > 0) {
									 for (var i = 0; i < runInfoTmp.length; i++) {
									 vm.runInfosBasic.push(runInfoTmp[i]);
									 }


									 }*/

									

									runInfoTmp.runStatus = vm.runInfosBasicMap[runInfoTmp.service.metadata.name];
									console.log(runInfoTmp.runStatus);
									vm.runInfosDetail.push(runInfoTmp);
									console.log(vm.runInfosDetail);
									for(var i = 0; i < vm.infos.length; i ++){
										if(runInfoTmp.service.metadata.name == vm.infos[i].name){
											vm.infos[i].state = runInfoTmp.runStatus;
											vm.infos[i].detailRunInfo = runInfoTmp;
											if(vm.infos[i].state == 'created'){
												vm.infos[i].isImageEnable = true;
												vm.infos[i].isDeployEnable = true;
												vm.infos[i].isStartEnable = false;
												vm.infos[i].isStopEnable = false;
												vm.infos[i].isRestartEnable = false;
												vm.infos[i].isDeleteEnable = false;
											}else if(vm.infos[i].state == 'Running'){
												vm.infos[i].isImageEnable = true;
												vm.infos[i].isDeployEnable = false;
												vm.infos[i].isStartEnable = false;
												vm.infos[i].isStopEnable = true;
												vm.infos[i].isRestartEnable = true;
												vm.infos[i].isDeleteEnable = true;
											}else if(vm.infos[i].state == 'Stopped'){
												vm.infos[i].isImageEnable = true;
												vm.infos[i].isDeployEnable = false;
												vm.infos[i].isStartEnable = true;
												vm.infos[i].isStopEnable = false;
												vm.infos[i].isRestartEnable = false;
												vm.infos[i].isDeleteEnable = true;
											}else if(vm.infos[i].state == 'Pending'){
												vm.infos[i].isImageEnable = true;
												vm.infos[i].isDeployEnable = false;
												vm.infos[i].isStartEnable = false;
												vm.infos[i].isStopEnable = false;
												vm.infos[i].isRestartEnable = false;
												vm.infos[i].isDeleteEnable = true;
											}
										}
									}



									vm.displayedCollection = [].concat(vm.infos);

									//vm.backAction();
								}, function (response) {
									vm.authError = response.statusText + '(' + response.status + ')';
									//console.log(vm.authError);
									//toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
									console.log('get detail run info fail.');
								});


							}



						}
						console.log(vm.runInfosBasic);
						//vm.backAction();
					},function (response) {
						vm.authError = response.statusText + '(' + response.status + ')';
						//console.log(vm.authError);
						//toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
						console.log('get basic run info fail.');
					});











				}






				//vm.displayedCollection = [].concat(vm.infos);
				// console.log(vm.displayedCollection);
				updatePagination(response.data);
            },function (response) {
            	vm.authError = response.statusText + '(' + response.status + ')';
               // toastr.error(vm.authError);
              //  console.log(response);
				console.log('get app info fail.');
            });






        };


		
		//add info
		function addNew() {
			$state.go('app.applicationedit');
		};
		//delete info one by one
		function deleteItem(item) {
			console.log(item);
			NetworkService.delete(constdata.api.application.appsPath + '/' + item.name,null,function success() {
				var index = vm.infos.indexOf(item);
				vm.infos.splice(index,1);
				toastr.success(i18n('u.DELETE_SUC'));
			},function (response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error(i18n('u.OPERATE_FAILED') + vm.authError);
			});
		};

       	//edit info one by one
       	function editItem(item) {
       		$state.go('app.applicationedit',{applicationName:item.name});
       	};



       	function goDetail(item) {
			$state.go('app.applicationDetail',{applicationName:item.name,HNATenantName:UserInfoServer.tenantName(),args:{tabSelectedIndex:0, selItem:item}});
		};







		//add info
		function OperApp(index, item) {
			if(index == 1){
				//console.log(item);

				//$('li#imageId').removeAttr('disabled');
				$state.go('app.applicationImage', {applicationName:item.id, args:{selItem:item}});
			}else if(index == 2){
				$state.go('app.applicationDeploy', {applicationName:item.id, args:{selItem:item}});

			}else if(index == 3){
				//$state.go('app.application', {applicationName:item.id, args:{selItem:item}});
				OperK8s(item,3);
			}else if(index == 4){
				OperK8s(item,4);
			}else if(index == 5){
				$state.go('app.application', {applicationName:item.id, args:{selItem:item}});
			}else if(index == 6){
				console.log('deleted');
				$state.go('app.application', {applicationName:item.id, args:{selItem:item}});
			}

			//$state.go('app.applicationedit');
		};

		// 分页 Start

		function OperK8s(item, st){
			console.log(item);
			if(st == 3){
				if(item.state == 'Running'){
					toastr.error('应用已经启动');
				}else{
					NetworkService.post(constdata.api.application.depPath + '/app/' + item.name + '?namespace=' + vm.userName, '', function (response) {
						var runInfoTmp = response.data;
						//toastr.success(i18n.t('u.ADD_SUC'));
						console.log('start app success.');
					}, function (response) {
						//vm.authError = response.statusText + '(' + response.status + ')';
						//console.log(vm.authError);
						//toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
						console.log('start app fail.');
					});

				}

			}else if(st == 4){
				if(item.state == 'Stopped'){
					toastr.error('应用已经停止');
				}else{
					NetworkService.post(constdata.api.application.depPath + '/app/' + item.name + '?namespace=' + vm.userName, '', function (response) {
						var runInfoTmp = response.data;
						//toastr.success(i18n.t('u.ADD_SUC'));
						console.log('stop app success.');
					}, function (response) {
						//vm.authError = response.statusText + '(' + response.status + ')';
						//console.log(vm.authError);
						//toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
						console.log('start app fail.');
					});

				}

			}

		}

		vm.preAction = preAction;
		vm.nextAction = nextAction;
		vm.goPage = goPage;
		vm.pageCurrentState = pageCurrentState;
		vm.tipsInfo = delmodaltip;
		vm.openAlert = openAlert;

		function preAction() {
			vm.pageCurrent --;
			if (vm.pageCurrent < 1) vm.pageCurrent = 1;
			getDatas();
		};
		function nextAction() {
			vm.pageCurrent ++;
			getDatas();
		};
		function goPage(page) {
			vm.pageCurrent = Number(page);
			getDatas();
		};
		function pageCurrentState(page) {
			if (Number(page) == vm.pageCurrent)
				return true;
			return false;
		};


		function updatePagination(pageination) {

			if (!pageination.hasContent){
				// toastr.error('当前无数据哦~');
				return;
			}

			var page = pageination.page;
			var toalPages = pageination.totalPages;

			vm.pageNextEnabled = pageination.hasNextPage;
			vm.pagePreEnabled = pageination.hasPreviousPage;


			if (toalPages < 2){
				vm.pages = ['1'];
			}else{
				vm.pages = [];
				var pageControl = 5;
				var stepStart = page - (pageControl - 1)/2;
				if (stepStart < 1 || toalPages < pageControl) stepStart = 1;
				var stepEnd = stepStart + pageControl - 1;
				if (stepEnd > toalPages) {
					stepEnd = toalPages;
					stepStart = toalPages - pageControl + 1;
					if (stepStart < 1){
						stepStart = 1;
					}
				}

				for (var i=stepStart;i<= (stepEnd > toalPages ? toalPages : stepEnd);i++) {
					vm.pages.push(i);
				}
			}

		}


		//Model
		function openAlert(size,model) {
			var modalInstance = $uibModal.open({
				templateUrl: 'myModalContent.html',
				size: size,
				controller:'ModalInstanceCtrl',
				resolve: {
					tipsInfo: function () {
						return vm.tipsInfo;
					}
				}
			});
			modalInstance.result.then(function (param) {
				vm.deleteItem(model);
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		}


    }

})();