angular.module('starter.controllers').controller('SettingsDeveloperCtrl', function($scope, Database, $translate) {
  $scope.deleteAll = function() {
    $translate('settings_CONFIRMDELETE').then(function successFn(translation) {
        var result = confirm(translation);

        if (result ) {
            Database.deleteAll();
        }
    }, function errorFn(translationId) {
      console.log('Translation failed:', translationId);
    });
  };

  $scope.createDemoData = function() {
    var result = confirm("Attention: Creating demo data will delete all your own data.");

    if (result ) {
      Database.createDemoData();
    }
  };

});