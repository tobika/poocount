angular.module('starter.controllers').controller('ListController', function($scope, Database, $timeout, ListService) {
  $scope.listData = [];
  $scope.allData = [];

  $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {

    if (Database.hasChanged('listController') === true) {

      $scope.groups = ListService.getDaysList();
      Database.gotData('listController');
    }
  });

})

.controller('ListDetailDayController', function($scope, $stateParams, ListService) {

  $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
    ListService.initListService().then(function() {
      $scope.listData = ListService.getDayList($stateParams.dayId);
      console.log(JSON.stringify($scope.listData));
    });
  });
})

.controller('FriendDetailController', function($scope, $stateParams, Database, $ionicHistory) {

  $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
    $scope.element = Database.get($stateParams.friendId);
  });

  $scope.deleteElement = function() {

  	Database.deleteElement($scope.element.id);
    $ionicHistory.goBack();
  };
});