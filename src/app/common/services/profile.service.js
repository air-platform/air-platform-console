/** StorageService */
angular
    .module('iot')
    .service('ProfileService', ProfileService);

/** @ngInject */
function ProfileService(NetworkService) {

    this.getProfile = function(path,successHandler,failedHandler) {
        NetworkService.get(path,'',successHandler,failedHandler);

    };

}

