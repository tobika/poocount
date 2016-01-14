angular.module('starter').config(function ($translateProvider) {

  $translateProvider.useStaticFilesLoader({
    prefix: 'locales/locale-',
    suffix: '.json'
  });

  $translateProvider.fallbackLanguage('en');

  $translateProvider.registerAvailableLanguageKeys(['en', 'fr', 'de'], {
    'en_US': 'en',
    'en_UK': 'en',
    'fr_FR': 'fr',
    'de_DE': 'de',
    'de_CH': 'de'
  });

  $translateProvider.determinePreferredLanguage();

});