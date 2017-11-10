angular.module('starter.controllers').controller('SettingsController', function($scope, SettingsService, AnalyticsService, $window) {

    var vm = this;

    SettingsService.getShowDiarrhea().then(function(value) {
        if (value) {
            vm.showDiarrhea = value;
        }
    });

    vm.showDiarrheaChange = function (value) {
        SettingsService.setShowDiarrhea(value);
    };

  vm.openStore = function() {
    AnalyticsService.trackEvent('pub', 'click');
    $window.open('https://play.google.com/store/apps/details?id=com.tobik.poocountv2&referrer=utm_source%3Dliteapp%26utm_medium%3Dapp', '_system');
  };

  $scope.$on("$ionicView.beforeEnter", function () {
      AnalyticsService.trackView('Settings');
  });
});