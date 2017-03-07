angular.module('starter.controllers').controller('ListController', ListController);

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

      if(typeof window.ga !== undefined) {
        window.ga.trackView('List')
      } else {
        console.log("Google Analytics Unavailable");
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