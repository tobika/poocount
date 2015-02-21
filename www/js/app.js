// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'angular-datepicker', 'pascalprecht.translate'])

.run(function($ionicPlatform, $translate, LanguageService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    //console.log(ionic.Platform.isWebView());
    console.log("Cordova ready");

    if ( navigator && navigator.splashscreen) {
      navigator.splashscreen.hide();
      console.log("Hide splashscreen");
    }


    LanguageService.initLanguage().then( function() {
      console.log("language initialized");

      var lang = LanguageService.getLanguage();
      console.log("language: " + lang);
      if (lang.length > 0) {
        console.log("Set preset language");
        $translate.use(lang);
      }
      else if (typeof navigator.globalization !== "undefined") {
      console.log("Get globalization");
      navigator.globalization.getLocaleName(
        function (locale) {
          console.log('locale: ' + locale.value + '\n');
          lang = locale.value.split("-")[0];
          $translate.use(lang).then(function(data) {
              LanguageService.setLanguage(lang);
              console.log("SUCCESS -> " + data);
          }, function(error) {
              console.log("ERROR -> " + error);
          });
        },
        function () {
          console.log('Error getting locale\n');
        }
      );

      console.log("End globalization");
    }
    else {
      console.log("No globalization plugin");
    }

    });

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  //$ionicConfigProvider.tabs.position("bottom");
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
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.add', {
      url: '/add',
      views: {
        'tab-add': {
          templateUrl: 'templates/tab-new.html',
          controller: 'AddCtrl'
        }
      }
    })

    .state('tab.stats', {
      url: '/stats',
      views: {
        'tab-stats': {
          templateUrl: 'templates/tab-stats.html',
          controller: 'StatsCtrl'
        }
      }
    })
    .state('tab.list', {
      url: '/list',
      views: {
        'tab-list': {
          templateUrl: 'templates/tab-list.html',
          controller: 'ListCtrl'
        }
      }
    })    
    .state('tab.list-detail', {
      url: '/list/:friendId',
      views: {
        'tab-list': {
          templateUrl: 'templates/list-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-settings.html',
          controller: 'AccountCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/add');

})

.config(function ($translateProvider) {
  $translateProvider.translations('en', {
    add_ADD: 'Add',
    add_DATE: 'Date',
    add_TODAY: 'Today',
    add_TIME: 'Time',
    add_NOW: 'Now',
    POO: 'Poo',
    add_NOTE: 'Note',
    add_BLOOD: 'Blood',
    list_LIST: 'List',
    stats_STATS: 'Statistics',
    settings_SETTINGS: 'Settings',
    settings_INFOCAREFUL: 'Developer settings (be careful):',
    settings_DELETEALL: 'Delete all',
    settings_LANGUAGE: 'Languages',
    settings_REMOVEDEFAULTLANGUAGE: 'Reset default language',
    settings_CONFIRMDELETE: 'Attention: All your data will be deleted',
    general_BACK: 'Back',
    general_DELETE: 'Delete'
    
  });

  $translateProvider.translations('fr', {
    add_ADD: 'Ajouter',
    add_DATE: 'Date',
    add_TODAY: 'Aujourd\'hui',
    add_TIME: 'Heure',
    add_NOW: 'Maintenant',
    POO: 'Poo',
    add_NOTE: 'Note',
    add_BLOOD: 'Sang',
    list_LIST: 'List',
    stats_STATS: 'Statistique',
    settings_SETTINGS: 'Reglages',
    settings_INFOCAREFUL: 'Reglages developpeur (attention):',
    settings_DELETEALL: 'Supprime tout',
    settings_LANGUAGE: 'Langues',
    settings_REMOVEDEFAULTLANGUAGE: 'Supprime language par defaut',
    settings_CONFIRMDELETE: 'Attention: All your data will be deleted',
    general_BACK: 'Retour',
    general_DELETE: 'Supprimer'
  });

  $translateProvider.translations('de', {
    add_ADD: 'Hinzufügen',
    add_DATE: 'Datum',
    add_TODAY: 'Heute',
    add_TIME: 'Uhrzeit',
    add_NOW: 'Jetzt',
    POO: 'Poo',
    add_NOTE: 'Notiz',
    add_BLOOD: 'Blut',
    list_LIST: 'Liste',
    stats_STATS: 'Statistik',
    settings_SETTINGS: 'Einstellungen',
    settings_INFOCAREFUL: 'Entwickler Einstellungen (Achtung):',
    settings_DELETEALL: 'Alle Daten löschen',
    settings_LANGUAGE: 'Sprachen',
    settings_REMOVEDEFAULTLANGUAGE: 'Standard Sprache zurücksetzen',
    settings_CONFIRMDELETE: 'Attention: All your data will be deleted',
    general_BACK: 'Zurück',
    general_DELETE: 'Löschen'
  });
  
  $translateProvider.fallbackLanguage('en');
  //$translateProvider.preferredLanguage('en');
  $translateProvider.determinePreferredLanguage();
  //console.log($translateProvider.determinePreferredLanguage());
});

