angular.module('starter.controllers').controller('SettingsBackupCtrl', function($scope, BackupService, $ionicActionSheet) {

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

  $scope.$on("$ionicView.enter", function() {
    $scope.getBackupFiles();
  });

});