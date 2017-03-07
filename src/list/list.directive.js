angular.module('starter.controllers').controller('ListController', ListController);

ListController.$inject = ['$scope','Database','ListService', 'AnalyticsService'];

function ListController($scope, Database, ListService, AnalyticsService) {

    var vm = this;

    vm.listData = [];
    vm.allData = [];

    init();

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {

        if (Database.hasChanged('listController') === true) {
            init();
        }

        AnalyticsService.trackView('List');
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