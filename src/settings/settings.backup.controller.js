angular.module('starter.controllers').controller('SettingsBackupController', function($scope, BackupService, $ionicActionSheet, AnalyticsService) {

    var vm = this;

    vm.exportBackup = function() {
        BackupService.exportBackup().then(function() {
            vm.getBackupFiles();
            AnalyticsService.trackEvent('backup', 'export');
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
                AnalyticsService.trackEvent('backup', 'import');
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
        AnalyticsService.trackView('Settings_Backup');
    });

});