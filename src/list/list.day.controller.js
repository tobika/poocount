angular.module('starter.controllers').controller('ListDetailDayController', function ($scope, $stateParams, ListService, AnalyticsService) {

    var vm = this;

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
        ListService.initListService().then(function () {
            vm.listData = ListService.getDayList($stateParams.dayId);
            //console.log(JSON.stringify($scope.listData));
        });

        AnalyticsService.trackView('List_Day');
    });
});