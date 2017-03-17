(function() {
	'use strict';

	angular.module('iot').controller('DgTopicModalCtrl', DgTopicModalCtrl);

	/** @ngInject */
	function DgTopicModalCtrl(NetworkService, constdata, toastr, $state, $stateParams, $uibModalInstance, prodnames, listToChoose) {
		/* jshint validthis: true */
		var vm = this;

		var pName = prodnames;

		vm.selectedOpt = '';
		vm.options = {
			hstep: listToChoose
			// hstep: ['topic2']
		};
		//添加
		vm.ok = function() {
			vm.sendData = {
				"name" : vm.selectedOpt
			}
			NetworkService.post(constdata.api.product.getdevicegroup + '/' + pName + '/devicegroup/topics',vm.sendData, function(response) {
				//关闭窗口,传递成功参数
				$uibModalInstance.close(vm.selectedOpt);
				toastr.success('添加成功');
			}, function(response) {
				//关闭窗口,传递失败参数
				$uibModalInstance.close(false);
				vm.authError = response.statusText + '(' + response.status + ')';
				toastr.error('添加失败：' + response.status + ' ' + response.statusText);
				console.log('Status' + response.status);
			});
		};

		vm.cancel = function() {
			$uibModalInstance.dismiss('cancel');
		};
	}

})();