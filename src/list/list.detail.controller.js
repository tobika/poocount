angular.module('starter.controllers').controller('FriendDetailController', function ($scope, $stateParams, Database, $ionicHistory) {

    var vm = this;

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
        vm.element = Database.get($stateParams.friendId);
    });

    vm.deleteElement = function () {

        Database.deleteElement(vm.element.id);
        $ionicHistory.goBack();
    };
});