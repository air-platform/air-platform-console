(function() {
	'user strict';

	angular.module('iot').controller('EventAddFormCtrl', EventAddFormCtrl);

	/** @ngInject */
	function EventAddFormCtrl($state,$http, toastr, constdata,StorageService, NetworkService,i18n,UserInfoServer) {
		var vm = this;
	
		vm.userTitle = i18n.t('event.ADD_EVENT');

		vm.submitAction = function() {

			NetworkService.post(constdata.api.event.eventPath,vm.event,function (response) {

				toastr.success(i18n.t('u.ADD_SUC'));

				var location = response.headers('location');
				var ids = location.split('/');
				var id = ids.pop();
				var steps = [{flag:true,status:true},{flag:false,status:false},{flag:false,status:false}];
				StorageService.item('steps',steps);

				$state.go('app.eventclassfamily',{eventId:id,HNATenantName:UserInfoServer.tenantName(),args:{isAddModel:true}});

			},function (response) {
				vm.authError = response.statusText + '(' + response.status + ')';
				console.log(vm.authError);
				toastr.error(i18n.t('u.OPERATE_FAILED') + vm.authError);
			});
		};
		//cancel back
		vm.cancelBack = function() {
			console.log()
			$state.go('app.event');
		}
	}
})();