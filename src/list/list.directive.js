angular.module('starter.directives').directive('list', ListDirective);

function ListDirective() {
    var directive = {
        templateUrl: 'list/list.template.html',
        controller: ListController,
        // note: This would be 'ExampleController' (the exported controller name, as string)
        // if referring to a defined controller in its separate file.
        controllerAs: 'lc',
        bindToController: true // because the scope is isolated
    };

    return directive;
}

ListController.$inject = ['$scope','Database','ListService'];

function ListController($scope, Database, ListService) {

    var vm = this;

    vm.listData = [];
    vm.allData = [];

    init();

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {

        if (Database.hasChanged('listController') === true) {
            init();
        }
    });

    function init() {
        console.log('request data service');
        ListService.initListService().then(function () {
            vm.groups = ListService.getDaysList();
            //console.log('data received', vm.groups);
            Database.gotData('listController');
        });
    }
}