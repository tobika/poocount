angular.module('starter.controllers').controller('ListController', function ($scope, Database, $timeout, ListService) {

    var vm = this;

    vm.listData = [];
    vm.allData = [];

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {

        if (Database.hasChanged('listController') === true) {

            vm.groups = ListService.getDaysList();
            Database.gotData('listController');
        }
    });
})

.controller('ListDetailDayController', function ($scope, $stateParams, ListService) {

    var vm = this;

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
        ListService.initListService().then(function () {
            vm.listData = ListService.getDayList($stateParams.dayId);
            //console.log(JSON.stringify($scope.listData));
        });
    });
})

.controller('FriendDetailController', function ($scope, $stateParams, Database, $ionicHistory) {

    var vm = this;

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
        vm.element = Database.get($stateParams.friendId);
    });

    vm.deleteElement = function () {

        Database.deleteElement(vm.element.id);
        $ionicHistory.goBack();
    };
});