angular.module('starter.controllers').controller('SettingsLanguagesController', function($scope, Database, $translate, SettingsService) {

    var vm = this;

    vm.setLanguage = function(lang) {
        console.log("Set language: " + lang);
        $translate.use(lang);
        SettingsService.setLanguage(lang);
    };
});