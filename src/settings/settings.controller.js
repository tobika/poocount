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

  $scope.$on("$ionicView.beforeEnter", function () {
    if(typeof window.ga !== undefined) {
      window.ga.trackView('List')
    } else {
      console.log("Google Analytics Unavailable");
    }
  });
});