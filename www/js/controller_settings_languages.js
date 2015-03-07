angular.module('starter.controllers').controller('SettingsLanguagesCtrl', function($scope, Database, $translate, LanguageService) {
  $scope.setLanguage = function(lang) {
    console.log("Set language: " + lang);
    $translate.use(lang);
    LanguageService.setLanguage(lang);
  };
});