angular.module('starter.services').factory('SettingsService', function($q) {
  var language = "",
  languageIsSet = false;

  localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: 'poocountStorage'
  });

  return {
    getLanguage: function() {
      return language;
    },
    setLanguage: function(newLanguage) {
      localforage.setItem('language', newLanguage);
      language = newLanguage;
    },
    initSettings: function () {
      var deferred = $q.defer();

      localforage.getItem('language').then(function(value) {
        // The same code, but using ES6 Promises.
        if (value) {
          language = value;
          languageIsSet = true;
        }
        deferred.resolve();
      });

      return deferred.promise;
    }
  };
});