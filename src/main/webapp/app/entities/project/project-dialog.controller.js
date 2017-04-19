(function() {
    'use strict';

    angular
        .module('proyectoProcesosApp')
        .controller('ProjectDialogController', ProjectDialogController);

    ProjectDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Project', 'Company', 'Task', 'Risk','$rootScope'];

    function ProjectDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Project, Company, Task, Risk,$rootScope) {
        var vm = this;

        vm.clear = clear;
        vm.save = save;
        vm.project = entity;

        vm.id  = $stateParams.id;




        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.project.id !== null) {

                Project.update(vm.project, onSaveSuccess, onSaveError);
            } else {
                vm.project.companyId = vm.id;
                Project.save(vm.project, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('proyectoProcesosApp:projectUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
