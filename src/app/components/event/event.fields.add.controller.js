(function() {
	'use strict';
	angular.module('iot').controller('EventAndEventClassesCtrl', EventAndEventClassesCtrl);

	function EventAndEventClassesCtrl($scope, $stateParams, $state,i18n, toastr,EventDataShareServer) {
		var vm = this;
		var isAdd = $stateParams.args.isAdd;
		vm.isEnum = false;
		vm.defaultShowRecordType = true;
		vm.fieldModel = false;

		vm.fieldInfo = {};
		vm.symbol = {};
		vm.symbolName = '';
		vm.symbolItemNames = '';

		vm.eventInfo = EventDataShareServer.eventClass;
		vm.selType = vm.eventInfo.type.replace(/(\w)/,function(v){return v.toUpperCase()});
		vm.selClassType = vm.eventInfo.classType.replace(/(\w)/,function(v){return v.toUpperCase()});


		vm.eventFieldOptions = [
			{title:'String',value:'string'},
			{title:'Bytes',value:'bytes'},
			{title:'Float',value:'float'},
			{title:'Double',value:'double'},
			{title:'Integer',value:'int'},
			{title:'Long',value:'long'},
			{title:'Bool',value:'bool'},
			{title:'Enumeration',value:'enum'}
		];
		vm.typeOptions = [
			'Record'
		];
		vm.typeClassOptions = [
			'Object', 'Event'
		];
		vm.selFieldType = vm.eventFieldOptions[0];


		vm.typeOptionChanged = function () {
			if (vm.eventInfo.type.toUpperCase() == 'RECORD'){
				vm.defaultShowRecordType = true;
			}else{
				vm.defaultShowRecordType = false;
			}
			vm.eventInfo.type = vm.selType.toLowerCase();
		}
		vm.typeClassOptionChanged = function () {
			vm.eventInfo.classType = vm.selClassType.toLowerCase();
		};
		vm.typeFieldOptionChanged = function () {
			vm.fieldInfo.type = vm.selFieldType.value;
			vm.symbolName = '';
			vm.symbolItemNames = '';
			if (vm.fieldInfo.type == 'enum'){
				vm.isEnum = true;
			}else{
				vm.isEnum = false;
			}
		}


		//添加Record类型
		vm.fieldAdd = function() {
			vm.fieldInfo = {type:'string',name:'',optional:false};
			vm.fieldModel = true;
			console.log(vm.fieldInfo.type);
			vm.selFieldType = vm.eventFieldOptions[0];
		}
		vm.fieldSave = function() {
			if(vm.fieldInfo.name == '') {

			} else {

				var syms = vm.symbolItemNames.split(","); //字符分割

				if (vm.fieldInfo.type == 'enum'){
					var newType = {type:"enum",name:vm.symbolName,symbols:syms};
					vm.fieldInfo.type = newType;
				}
				vm.eventInfo.fields.push(vm.fieldInfo);
				// console.log(vm.eventInfo.fields);
				vm.fieldModel = false;
			}
			vm.isEnum = false;
		}
		vm.fieldDelete = function (item) {
			var index = vm.eventInfo.fields.indexOf(item);
			vm.eventInfo.fields.splice(index,1);
			toastr.success(i18n.t('u.DELETE_SUC'));
		}
		vm.fieldCancel = function() {
			vm.fieldModel = false;
			vm.isEnum = false;
			vm.symbolName = '';
			vm.symbolItemNames = '';
		}
		//-


		//添加enum类型
		vm.fieldEnumAdd = function() {
			vm.symbol = '';
			vm.fieldModel = true;
		}
		vm.fieldEnumSave = function() {
			if(vm.symbol == '') {

			} else {
				vm.eventInfo.symbols.push(vm.symbol);
				vm.fieldModel = false;
			}
		}
		vm.fieldEnumDelete = function (item) {
			var index = vm.eventInfo.symbols.indexOf(item);
			vm.eventInfo.symbols.splice(index,1);
			toastr.success('删除成功');
		}
		vm.fieldEnumCancel = function() {
			vm.fieldModel = false;
		}

		vm.submitAction = function () {
			if (vm.defaultShowRecordType){
				// vm.eventInfo.symbols = [];
			}else{
				vm.eventInfo.fields = [];
			}

			EventDataShareServer.eventClass = vm.eventInfo;

			//判断一下数组里面是否已经有这个对象了
			var isContain = $.inArray(EventDataShareServer.eventClass, EventDataShareServer.eventClasses);

			var isEdit = EventDataShareServer.isEditMode;

			if (isContain < 0){
				if (isEdit < 0){
					EventDataShareServer.eventClasses.push(vm.eventInfo);
				}else{
					EventDataShareServer.eventClasses.splice(isEdit,1,EventDataShareServer.eventClass)
				}
			}

			vm.cancelAction();

		}

		vm.cancelAction = function () {
			EventDataShareServer.navStepTitles.pop();
			EventDataShareServer.navStepIndex = EventDataShareServer.navStepIndex - 1;
			// console.log(isAdd);
			$state.go('app.eventclassfamily.basic',{args:{isAdd:isAdd}});

			$scope.$bus.publish({
				channel: 'refresh',
				topic: 'step',
				data: { /* order info */ }
			});
		}



		vm.shouldUpperCase = function (v) {
			return v.replace(/(\w)/,function(v){return v.toUpperCase()});
		}

	}

})();