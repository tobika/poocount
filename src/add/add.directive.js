angular.module('starter.directives').directive('add', AddDirective);

function AddDirective() {
    var directive = {
        templateUrl: 'add/add.template.html',
        controller: AddController,
        // note: This would be 'ExampleController' (the exported controller name, as string)
        // if referring to a defined controller in its separate file.
        controllerAs: 'ac',
        bindToController: true // because the scope is isolated
    };

    return directive;
}

AddController.$inject = ['$scope','Database','SettingsService','$window', 'AnalyticsService'];

function AddController($scope, Database, SettingsService, $window, AnalyticsService) {

    var vm = this;

    vm.element = {date: moment().format('DD/MM/YYYY'), time: moment().format('HH:mm')};

    init();

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {

        init();
    });

    vm.add = function () {

        var element = vm.element;

        // check if there is no timezone problem anymore, before it was moment.utc
        element.date = moment(element.date + " " + element.time, "DD/MM/YYYY HH:mm").toDate();

        AnalyticsService.trackEvent('add', vm.element.type);

        console.log(element);
        Database.add(element);
        vm.element = {
            date: moment(vm.element.date).format('DD/MM/YYYY'),
            time: vm.element.time,
            type: vm.element.type,
            blood: vm.element.blood
        };

        if (vm.showDiarrhea) {

            vm.element.diarrhea = element.diarrhea;
        }

        if ($window.plugins) {

            $window.plugins.toast.show('New entry added: ' + element.date.toString(), 'long', 'bottom',
                function (a) {
                    console.log('toast success: ' + a);
                },
                function (b) {
                    alert('toast error: ' + b);
                });
        }
    };

    vm.desktop = !ionic.Platform.isWebView();//!$ionicPlatform.isWebView();

    vm.options = {
        format: 'dd/mm/yyyy', // ISO formatted date
        //clear: null,
        //container: 'body',
        onClose: function (e) {
            // do something when the picker closes
        }
    };

    vm.optionsTime = {
        format: 'HH:i', // ISO formatted date
        onClose: function (e) {
            // do something when the picker closes
        }
    };

    vm.today = function () {

        vm.element.date = moment().format('DD/MM/YYYY');
    };
    vm.now = function () {

        vm.element.time = moment().format('HH:mm');
    };

    vm.setType = function (type) {

        vm.element.type = type;
    };

    vm.setBlood = function (blood) {

        vm.element.blood = blood;
    };

    vm.setDiarrhea = function (diarrhea) {

        vm.element.diarrhea = diarrhea;
    };

    vm.isSelected = function (type) {
        return type == vm.element.type;
    };

    vm.convertToDate = function (stringDate) {

        return "moment(stringDate).format('DD/MM/YYYY')";
    };

    function init() {
        SettingsService.getShowDiarrhea().then(function(value) {
            if (value) {
                vm.showDiarrhea = value;
            }
        });

        AnalyticsService.trackView('Add');
    }

}