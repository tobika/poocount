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

AddController.$inject = ['$scope','Database','SettingsService','$window', 'AnalyticsService', '$ionicModal'];

function AddController($scope, Database, SettingsService, $window, AnalyticsService, $ionicModal) {

    var vm = this;

    vm.element = {date: moment().format('DD/MM/YYYY'), time: moment().format('HH:mm')};

    init();

  vm.modal = $ionicModal.fromTemplate('<ion-modal-view>' +
    '<ion-content>' +
    '<div class="list card">\n' +
    '\n' +
    '                <div class="item item-avatar">\n' +
    '                    <img src="poo_smiley.png">\n' +
    '                    <h2>New improved Poocount</h2>\n' +
    '                    <p>More tracking possibilities/statistics</p>\n' +
    '                </div>\n' +
    '\n' +
    '                <div class="item item-body">\n' +
    '                    <img class="full-image" src="poocountv2.png">\n' +
    '                    <p>\n' +
    '                        Hi, I\'m Tobias, the creator of Poocount. I hope you like Poocount and it bring some help in your everyday life. </p>\n' +
    '                    <p>For the past 3 years I received a lot of feedback from users like yourself and decided to make Poocount even better.\n' +
    '                    </p>\n' +
    '                    <p>\n' +
    '                        You can now track the Boston Stool Scale and even add your own tracking parameters like urgency/pain or other symptons that are important to your condition.\n' +
    '\n' +
    '                        Get more info on the play store or contact me if you have any questions.\n' +
    '                    </p>\n' +
    '                    <p>\n' +
    '                        <img width="70%" ng-click="ac.openStore()" src="playstore.png">\n' +
    '                    </p>\n' +
    '                </div>\n' +
    '\n' +
    '<button ng-click="ac.closeModal()" class="button padding button-block button-outline button-positive">' +
    'Close' +
    '</button>' +
    '</div></ion-modal-view>', {
    scope: $scope,
    animation: 'slide-in-up'
  });

  vm.openModal = function () {
    vm.modal.show();
  };
  vm.closeModal = function () {
    vm.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    vm.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function () {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function () {
    // Execute action
  });

  $scope.$on("$ionicView.beforeEnter", function (scopes, states) {
    init();
  });

  $scope.$on("$ionicView.afterEnter", function (scopes, states) {
      SettingsService.getShowPoocount2().then( function(result) {
        result = result || 0;
        result++;
        console.log(result);

        if (result > 10) return;

        SettingsService.setShowPoocount2(result);

        if (result === 10) {
          vm.modal.show();
        }
      });
  });

  vm.openStore = function() {
    $window.open('https://play.google.com/store/apps/details?id=com.tobik.poocountv2&referrer=utm_source%3Dliteapp%26utm_medium%3Dapp', '_system')
  };

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