angular.module('starter.controllers').controller('SettingsLanguagesController', function($scope, Database, $translate, SettingsService, AnalyticsService) {

    var vm = this;

    vm.setLanguage = function(lang) {
        console.log("Set language: " + lang);
        $translate.use(lang);
        SettingsService.setLanguage(lang);
    };

    $scope.$on("$ionicView.beforeEnter", function () {
        AnalyticsService.trackView('Settings_Languages');
    });
});