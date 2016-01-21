angular.module('starter.controllers').controller('SettingsLanguagesController', function($scope, Database, $translate, SettingsService) {
  $scope.setLanguage = function(lang) {
    console.log("Set language: " + lang);
    $translate.use(lang);
    SettingsService.setLanguage(lang);
  };
});