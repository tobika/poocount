angular.module('starter.controllers').controller('AccountCtrl', function($scope, Database, $translate, LanguageService, BackupService, $ionicActionSheet) {
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
    }, function() {
      console.log("Backupfiles: Error accessing filesystem.");
    });
  };

  $scope.showActionSheetImport = function(backupFileId) {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Import Backup' }
     ],
     destructiveText: 'Delete',
     titleText: $scope.backupFiles[backupFileId].name,
     cancelText: 'Cancel',
     buttonClicked: function(index) {
       BackupService.importBackup($scope.backupFiles[backupFileId].nativeURL);
       return true;
     },
     destructiveButtonClicked: function() {
       BackupService.deleteBackupFile($scope.backupFiles[backupFileId].nativeURL);
       $scope.getBackupFiles();
       return true;
     }
   });

  };

  $scope.$on("$ionicView.enter", function( scopes, states ) {
    $scope.getBackupFiles();
  });

});