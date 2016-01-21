angular.module('starter.controllers').controller('SettingsController', function($scope, SettingsService) {
  SettingsService.getShowDiarrhea().then(function(value) {
    if (value) {
      $scope.showDiarrhea = value;
    }
  });

  $scope.showDiarrheaChange = function (value) {
    SettingsService.setShowDiarrhea(value);
  };
});