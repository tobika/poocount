angular.module('starter.controllers').controller('TabController', function($scope, Database) {

  $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
    Database.lastEntry(function(lastEntry) {
      $scope.lastEntry = lastEntry;
    });
  });
});