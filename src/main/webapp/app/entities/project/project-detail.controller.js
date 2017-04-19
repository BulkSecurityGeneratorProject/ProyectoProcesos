(function() {
    'use strict';

    angular
        .module('proyectoProcesosApp')
        .controller('ProjectDetailController', ProjectDetailController);

    ProjectDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Project', 'Company', 'Task', 'Risk','$http','$mdDialog'];

    function ProjectDetailController($scope, $rootScope, $stateParams, previousState, entity, Project, Company, Task, Risk,$http,$mdDialog) {
        var vm = this;

        vm.project = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('proyectoProcesosApp:projectUpdate', function(event, result) {
            vm.project = result;
        });
        $scope.$on('$destroy', unsubscribe);

        function init(){
            getRisks();
            getTask();
            getRisksMatrix();
            getEV();
        }
        init();

        function getTask(){
            $http.get('http://localhost:9000/api/tasks/project/'+ vm.project.id)
                .success(function(data){
                    vm.tasks = data;
                });
        }

        function getEV(){
            $http.post('http://localhost:9000/api/projects/calculations/'+ vm.project.id)
                .success(function(data){
                    vm.results = data;
                    console.log(data);
                });
        }

        function getRisks(){
            $http.get('http://localhost:9000/api/risks/project/'+ vm.project.id)
                .success(function(data){
                    vm.risks = data;
                });
        }

        function getRisksMatrix(){
            $http.get('http://localhost:9000/api/risks/matrix/'+ vm.project.id)
                .success(function(data){
                    vm.matrix = data;
                });
        }

        $scope.$on('proyectoProcesosApp:riskUpdate', function(){
            getRisks();
        });

        $scope.$on('proyectoProcesosApp:taskUpdate', function(){
            getTask();
        });


        vm.deleteRisk = function(id){
            Risk.delete({id: id},
                function () {
                    getRisks();
                });
        }

        vm.deleteTask = function(id){
            Task.delete({id: id},
                function () {
                    getTask();
                });
        }

        vm.completed = function(ev,id) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
                .title('¿Terminaste la tarea?')
                .textContent('Por favor ingresa las horas que se invirtieron en la tarea.')
                .placeholder('Horas: ejemplo 1')
                .ariaLabel('Dog name')
                .initialValue('')
                .targetEvent(ev)
                .ok('Guardar')
                .cancel('cancelar');

            $mdDialog.show(confirm).then(function(result) {
                var realHour = parseFloat(result);

                $http.get('http://localhost:9000/api/tasks/finished/'+id+'/'+realHour)
                    .success(function(data){
                        init();
                    });
            }, function() {

            });
        };

        $scope.limitOptions = [5, 10, 15];
        $scope.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };
        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };
        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

        // ---------------
        $scope.limitOptionsR = [5, 10, 15];
        $scope.optionsR = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };
        $scope.queryR = {
            order: 'name',
            limit: 5,
            page: 1
        };
        $scope.toggleLimitOptions = function () {
            $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
        };

    }
})();
