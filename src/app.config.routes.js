angular.module('starter').config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.position("top");
    //ionicConfigProvider.views.maxCache(0);

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "tab/tab.template.html",
            controller: 'TabController',
            controllerAs: 'tc'
        })

        // Each tab has its own nav history stack:

        .state('tab.add', {
            url: '/add',
            views: {
                'tab-add': {
                    template: '<add></add>'
                }
            }
        })
        .state('tab.stats', {
            url: '/stats',
            views: {
                'tab-stats': {
                    templateUrl: 'stats/stats.charts.template.html',
                    controller: 'StatsChartsController',
                    controllerAs: 'sc'
                }
            }
        })
        .state('tab.list', {
            url: '/list',
            views: {
                'tab-list': {
                    templateUrl: 'list/list.template.html',
                    controller: 'ListController',
                    controllerAs: 'lc'
                }
            }
        })
        .state('tab.list-day', {
            url: '/listday/:dayId',
            views: {
                'tab-list': {
                    templateUrl: 'list/list.day.template.html',
                    controller: 'ListDetailDayController',
                    controllerAs: 'lc'
                }
            }
        })
        .state('tab.list-detail', {
            url: '/list/:friendId',
            views: {
                'tab-list': {
                    templateUrl: 'list/list.detail.template.html',
                    controller: 'FriendDetailController',
                    controllerAs: 'lc'
                }
            }
        })
        .state('tab.settings', {
            url: '/settings',
            views: {
                'tab-settings': {
                    templateUrl: 'settings/settings.template.html',
                    controller: 'SettingsController',
                    controllerAs: 'sc'
                }
            }
        })
        .state('tab.settings-languages', {
            url: '/settings/languages',
            views: {
                'tab-settings': {
                    templateUrl: 'settings/settings.languages.template.html',
                    controller: 'SettingsLanguagesController',
                    controllerAs: 'lc'
                }
            }
        })
        .state('tab.settings-backup', {
            url: '/settings/backup',
            views: {
                'tab-settings': {
                    templateUrl: 'settings/settings.backup.template.html',
                    controller: 'SettingsBackupController',
                    controllerAs: 'bc'
                }
            }
        })
        .state('tab.settings-developer', {
            url: '/settings/developer',
            views: {
                'tab-settings': {
                    templateUrl: 'settings/settings.developer.template.html',
                    controller: 'SettingsDeveloperController',
                    controllerAs: 'dc'
                }
            }
        })
        .state('tab.settings-help', {
            url: '/settings/help',
            views: {
                'tab-settings': {
                    templateUrl: 'settings/settings.help.template.html'
                }
            }
        });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/add');

});