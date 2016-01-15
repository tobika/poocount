angular.module('starter.controllers').controller('SettingsCtrl', function($scope, SettingsService) {
  SettingsService.getShowDiarrhea().then(function(value) {
    if (value) {
      $scope.showDiarrhea = value;
    }
  });

  $scope.showDiarrheaChange = function (value) {
    SettingsService.setShowDiarrhea(value);
  };
});