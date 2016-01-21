angular.module('starter.controllers').controller('TabController', function($scope, Database) {

    var vm = this;

    $scope.$on("$ionicView.beforeEnter", function() {
        Database.lastEntry(function(lastEntry) {
            vm.lastEntry = lastEntry;
        });
    });
});