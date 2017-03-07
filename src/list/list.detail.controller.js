angular.module('starter.controllers').controller('FriendDetailController', function ($scope, $stateParams, Database, $ionicHistory, AnalyticsService) {

    var vm = this;

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
        vm.element = Database.get($stateParams.friendId);

        AnalyticsService.trackView('List_Detail');
    });

    vm.deleteElement = function () {

        Database.deleteElement(vm.element.id);
        $ionicHistory.goBack();
    };
});