angular.module('starter.controllers').controller('AddController', function ($scope, Database, SettingsService) {

    var vm = this;

    vm.element = {date: moment().format('DD/MM/YYYY'), time: moment().format('HH:mm')};

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {

         SettingsService.getShowDiarrhea().then(function(value) {
            if (value) {
                vm.showDiarrhea = value;
            }
        });
    });

    vm.add = function () {

        var element = vm.element;

        // check if there is no timezone problem anymore, before it was moment.utc
        element.date = moment(element.date + " " + element.time, "DD/MM/YYYY HH:mm").toDate();

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
        // TODO simplify
        console.log("isSelected");
        if (type == vm.element.type) {
            return true;
        }
        return false;
    };

    vm.convertToDate = function (stringDate) {

        return "moment(stringDate).format('DD/MM/YYYY')";
    };

});