// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in service_database.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'angular-datepicker', 'pascalprecht.translate'])

.run(function($ionicPlatform, $translate, SettingsService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    //console.log(ionic.Platform.isWebView());
    console.log("Cordova ready");

    if ( navigator && navigator.splashscreen) {
      navigator.splashscreen.hide();
      console.log("Hide splashscreen");
    }


    SettingsService.initSettings().then( function() {
      console.log("language initialized");

      var lang = SettingsService.getLanguage();
      console.log("language: " + lang);
      if (lang.length > 0) {
        console.log("Set preset language");
        $translate.use(lang);
      }
      else if (typeof navigator.globalization !== "undefined") {
      console.log("Use globalization plugin");
      navigator.globalization.getLocaleName(
        function (locale) {
          console.log('locale: ' + locale.value + '\n');
          lang = locale.value.split("-")[0];
          $translate.use(lang).then(function(data) {
            SettingsService.setLanguage(lang);
              console.log("SUCCESS -> " + data);
          }, function(error) {
              console.log("ERROR -> " + error);
          });
        },
        function () {
          console.log('Error getting locale\n');
        }
      );

      console.log("End use of globalization plugin");
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

.config(['$compileProvider', function ($compileProvider) {
  // only use this in production build
  $compileProvider.debugInfoEnabled(false);
}]);

angular.module('starter.services', ['ngCordova']);

angular.module('starter.controllers', ['pascalprecht.translate']);
