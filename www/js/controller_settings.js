poomodule.controller('AccountCtrl', function($scope, Database, $translate, LanguageService, BackupService, $ionicActionSheet) {
  $scope.deleteAll = function() {
    $scope.translatedText = $translate('settings_CONFIRMDELETE');
    console.log(JSON.stringify($scope.translatedText));
    var result = confirm("Attention: All your data will be deleted");

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

  $scope.showActionSheetImport = function(backupFileId) {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Import Backup ' }
     ],
     destructiveText: 'Delete',
     titleText: $scope.backupFiles[backupFileId].name,
     cancelText: 'Cancel',
     buttonClicked: function(index) {
       BackupService.importBackup($scope.backupFiles[backupFileId].nativeURL);
       return true;
     },
     destructiveButtonClicked: function() {
       alert("Develop delete function. Please delete the file directly in your file-browser.");
       return true;
     }
   });

  };

  $scope.$on("$ionicView.enter", function( scopes, states ) {
    $scope.getBackupFiles();
  });

});