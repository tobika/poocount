angular.module('starter.controllers').controller('AddCtrl', function ($scope, Database, SettingsService) {

    $scope.element = {date: moment().format('DD/MM/YYYY'), time: moment().format('HH:mm')};

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {

         SettingsService.getShowDiarrhea().then(function(value) {
            if (value) {
                $scope.showDiarrhea = value;
            }
        });
    });

    $scope.add = function () {

        var element = $scope.element;

        // check if there is no timezone problem anymore, before it was moment.utc
        element.date = moment(element.date + " " + element.time, "DD/MM/YYYY HH:mm").toDate();

        console.log(element);
        Database.add(element);
        $scope.element = {
            date: moment($scope.element.date).format('DD/MM/YYYY'),
            time: $scope.element.time,
            type: $scope.element.type,
            blood: $scope.element.blood
        };

        if ($scope.showDiarrhea) {

            $scope.element.diarrhea = element.diarrhea;
        }

        if (window.plugins) {

            window.plugins.toast.show('New entry added: ' + element.date.toString(), 'long', 'bottom',
                function (a) {
                    console.log('toast success: ' + a);
                },
                function (b) {
                    alert('toast error: ' + b);
                });
        }
    };

    $scope.desktop = !ionic.Platform.isWebView();//!$ionicPlatform.isWebView();

    $scope.options = {
        format: 'dd/mm/yyyy', // ISO formatted date
        //clear: null,
        //container: 'body',
        onClose: function (e) {
            // do something when the picker closes
        }
    };

    $scope.optionsTime = {
        format: 'HH:i', // ISO formatted date
        onClose: function (e) {
            // do something when the picker closes
        }
    };

    $scope.today = function () {

        $scope.element.date = moment().format('DD/MM/YYYY');
    };
    $scope.now = function () {

        $scope.element.time = moment().format('HH:mm');
    };

    $scope.setType = function (type) {

        $scope.element.type = type;
    };

    $scope.setBlood = function (blood) {

        $scope.element.blood = blood;
    };

    $scope.setDiarrhea = function (diarrhea) {

        $scope.element.diarrhea = diarrhea;
    };

    $scope.isSelected = function (type) {
        // TODO simplify
        console.log("isSelected");
        if (type == $scope.element.type) {
            return true;
        }
        return false;
    };

    $scope.convertToDate = function (stringDate) {

        return "moment(stringDate).format('DD/MM/YYYY')";
    };

});