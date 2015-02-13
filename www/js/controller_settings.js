poomodule.controller('AccountCtrl', function($scope, Database, $translate, LanguageService) {
  $scope.deleteAll = function() {
    Database.deleteAll();
  };

  $scope.setLanguage = function(lang) {
    console.log("Set language: " + lang);
    $translate.use(lang);
    LanguageService.setLanguage(lang);
  };
});
