angular.module('starter.directives').directive('exportcsv', ExportCsvDirective);

function ExportCsvDirective() {
    var directive = {
        template: '<button class="button button-clear button-positive" ng-click="ec.openPopover($event)">Export</button>',
        controller: ExportCsvController,
        // note: This would be 'ExampleController' (the exported controller name, as string)
        // if referring to a defined controller in its separate file.
        controllerAs: 'ec',
        bindToController: true // because the scope is isolated
    };

    return directive;
}

ExportCsvController.$inject = ['$scope','ExportCsvService','$ionicPopover','$window', 'AnalyticsService'];

function ExportCsvController($scope, ExportCsvService, $ionicPopover, $window, AnalyticsService) {

    var vm = this;

    $ionicPopover.fromTemplateUrl('list/export.popover.html', {
        scope: $scope
    }).then(function(popover) {
        vm.popover = popover;
    });


    vm.openPopover = function($event) {
        vm.popover.show($event);
    };
    vm.closePopover = function() {
        vm.popover.hide();
    };

    $scope.exportCsv = function() {
        AnalyticsService.trackEvent('backup', 'csv');

        ExportCsvService.exportCsv().then(function () {
            if ($window.plugins) {

                $window.plugins.toast.show('Export to internal memory complete.', 'long', 'bottom');
            }
        });
        vm.popover.hide();
    }
}