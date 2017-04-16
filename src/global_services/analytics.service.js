angular.module('starter.services').factory('AnalyticsService', AnalyticsService);

//SettingsService.$inject=['$q'];

function AnalyticsService() {
  var GA_ID = "UA-92621183-2";

  return {
    init: function() {
      if(typeof window.ga !== undefined) {
        window.ga.startTrackerWithId(GA_ID, null,
          function() {
            console.log('Google Analytics initialized');
            window.ga.setAnonymizeIp(true);
            //window.ga.debugMode();
            window.ga.enableUncaughtExceptionReporting(true);

            // always track first view after init and start new session
            window.ga.trackView('Add','', true);
          },
          function() {
            console.log('Error initialzing Google Analytics');
          });
      } else {
        console.log("Google Analytics Unavailable");
      }
    },
    trackView: function(title) {
      // use try in case function is used before ga is initialized
      try {
        if (typeof window.ga !== undefined) {
          window.ga.trackView(title)
        } else {
          console.log("Google Analytics Unavailable");
        }
      } catch (e){
        console.log('Google Analytics not ready yet');
      }
    },
    trackEvent: function(category, action, label, value) {
      // use try in case function is used before ga is initialized
      try {
        if (typeof window.ga !== undefined) {
          window.ga.trackEvent(category, action, label, value);
        } else {
          console.log("Google Analytics Unavailable");
        }
      } catch (e){
        console.log('Google Analytics not ready yet');
      }
    }
  };
}