poomodule.controller('AccountCtrl', function($scope, Database, $translate, LanguageService, BackupService) {
  $scope.deleteAll = function() {
    $scope.translatedText = $translate('settings_CONFIRMDELETE');
    console.log(JSON.stringify($scope.translatedText));
    var result = confirm($scope.translatedText);

    if (result ) {
      Database.deleteAll();
    }    
  };

  $scope.setLanguage = function(lang) {
    console.log("Set language: " + lang);
    $translate.use(lang);
    LanguageService.setLanguage(lang);
  };

  $scope.exportBackup = function() {
    BackupService.exportBackup().then(function() {
      $scope.getBackupFiles();
    });

  };

  $scope.getBackupFiles = function() {
    BackupService.getBackupFiles().then( function(results) {
      console.log(JSON.stringify(results));
      $scope.backupFiles = results;
    });
  };

  $scope.$on("$ionicView.enter", function( scopes, states ) {
    $scope.getBackupFiles();
  });

});