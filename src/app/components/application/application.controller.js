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


		getDatas();



		function getDatas() {
            NetworkService.get(constdata.api.application.appsPath,{page:vm.pageCurrent},function (response) {
				vm.infos = response.data.content;
				// console.log(response.data);
				updatePagination(response.data);
            },function (response) {
            	vm.authError = response.statusText + '(' + response.status + ')';
                toastr.error(vm.authError);
                console.log(response);
            });
        };

		vm.displayedCollection = [].concat(vm.infos);
		
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
			$state.go('app.applicationDetail',{applicationName:item.name,HNATenantName:UserInfoServer.tenantName(),args:{tabSelectedIndex:0}});
		};



		// 分页 Start



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