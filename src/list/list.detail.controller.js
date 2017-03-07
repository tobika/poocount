angular.module('starter.controllers').controller('FriendDetailController', function ($scope, $stateParams, Database, $ionicHistory) {

    var vm = this;

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
        vm.element = Database.get($stateParams.friendId);

        if(typeof window.ga !== undefined) {
            window.ga.trackView('List_Detail')
        } else {
            console.log("Google Analytics Unavailable");
        }
    });

    vm.deleteElement = function () {

        Database.deleteElement(vm.element.id);
        $ionicHistory.goBack();
    };
});