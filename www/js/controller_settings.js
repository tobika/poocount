poomodule.controller('AccountCtrl', function($scope, Database, $translate, LanguageService) {
  $scope.deleteAll = function() {
    var result = confirm('Attention: All your data will be deleted');

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
