angular.module('starter.controllers').controller('ListDetailDayController', function ($scope, $stateParams, ListService) {

    var vm = this;

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
        ListService.initListService().then(function () {
            vm.listData = ListService.getDayList($stateParams.dayId);
            //console.log(JSON.stringify($scope.listData));
        });

        if(typeof window.ga !== undefined) {
            window.ga.trackView('List_Day')
        } else {
            console.log("Google Analytics Unavailable");
        }
    });
});