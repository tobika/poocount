angular.module('starter.controllers').controller('SettingsCtrl', function($scope, SettingsService) {
  $scope.showDiarrhea = SettingsService.getShowDiarrhea();

  $scope.showDiarrheaChange = function (value) {
    SettingsService.setShowDiarrhea(value);
  };
});