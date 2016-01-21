angular.module('starter.controllers').controller('SettingsBackupController', function($scope, BackupService, $ionicActionSheet) {

    var vm = this;

    vm.exportBackup = function() {
        BackupService.exportBackup().then(function() {
            vm.getBackupFiles();
        });

    };

    vm.getBackupFiles = function() {
        BackupService.getBackupFiles().then( function(results) {
            //console.log(JSON.stringify(results));
            vm.backupFiles = results;
        }, function() {
            console.log("Backupfiles: Error accessing filesystem.");
        });
    };

    vm.showActionSheetImport = function(backupFileId) {
        // Show the action sheet
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'Import Backup' }
            ],
            destructiveText: 'Delete',
            titleText: vm.backupFiles[backupFileId].name,
            cancelText: 'Cancel',
            buttonClicked: function(index) {
                BackupService.importBackup(vm.backupFiles[backupFileId].nativeURL);
                return true;
            },
            destructiveButtonClicked: function() {
                BackupService.deleteBackupFile(vm.backupFiles[backupFileId].nativeURL);
                vm.getBackupFiles();
                return true;
            }
        });
    };

    $scope.$on("$ionicView.enter", function() {
        vm.getBackupFiles();
    });

});