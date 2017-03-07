angular.module('starter.controllers').controller('SettingsDeveloperController', function(Database, $translate, $scope, AnalyticsService) {

    var vm = this;

    vm.deleteAll = function() {
        $translate('settings_CONFIRMDELETE').then(function successFn(translation) {
            var result = confirm(translation);

            if (result ) {
                Database.deleteAll();
            }
        }, function errorFn(translationId) {
            console.log('Translation failed:', translationId);
        });
    };

    vm.createDemoData = function() {
        var result = confirm("Attention: Creating demo data will delete all your own data.");

        if (result ) {
            Database.createDemoData();
        }
    };

    $scope.$on("$ionicView.beforeEnter", function () {
        AnalyticsService.trackView('Settings_Developer');
    });
});