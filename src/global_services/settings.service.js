angular.module('starter.services').factory('SettingsService', SettingsService);

SettingsService.$inject=['$q'];

function SettingsService($q) {
    var language = "",
        languageIsSet = false,
        showDiarrhea = false;

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
            // could I move this just on top like with showDiarrhea?? to test

            var deferred = $q.defer();

            localforage.getItem('language').then(function(value) {
                if (value) {
                    language = value;
                    languageIsSet = true;
                }
                deferred.resolve();
            });

            return deferred.promise;
        },
        getShowDiarrhea: function () {
            return localforage.getItem('showDiarrhea');
        },
        setShowDiarrhea: function(newShowDiarrhea) {
            localforage.setItem('showDiarrhea', newShowDiarrhea);
            showDiarrhea = newShowDiarrhea;
        },
        getShowPoocount2: function () {
            return localforage.getItem('showPoocount2');
        },
        setShowPoocount2: function(count) {
            localforage.setItem('showPoocount2', count);
        }
    };
}