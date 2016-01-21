angular.module('starter.controllers').controller('SettingsController', function($scope, SettingsService) {

    var vm = this;

    SettingsService.getShowDiarrhea().then(function(value) {
        if (value) {
            vm.showDiarrhea = value;
        }
    });

    vm.showDiarrheaChange = function (value) {
        SettingsService.setShowDiarrhea(value);
    };
});