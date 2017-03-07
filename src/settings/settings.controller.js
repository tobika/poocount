angular.module('starter.controllers').controller('SettingsController', function($scope, SettingsService, AnalyticsService) {

    var vm = this;

    SettingsService.getShowDiarrhea().then(function(value) {
        if (value) {
            vm.showDiarrhea = value;
        }
    });

    vm.showDiarrheaChange = function (value) {
        SettingsService.setShowDiarrhea(value);
    };

  $scope.$on("$ionicView.beforeEnter", function () {
      AnalyticsService.trackView('Settings');
  });
});