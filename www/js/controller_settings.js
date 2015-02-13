poomodule.controller('AccountCtrl', function($scope, Database, $translate, LanguageService) {
  $scope.deleteAll = function() {
    $scope.translatedText = $translate('settings_CONFIRMDELETE');
    console.log(JSON.stringify($scope.translatedText));
    var result = confirm($scope.translatedText);

    if (result ) {
      Database.deleteAll();
    }    
  };

  $scope.setLanguage = function(lang) {
    console.log("Set language: " + lang);
    $translate.use(lang);
    LanguageService.setLanguage(lang);
  };
});
