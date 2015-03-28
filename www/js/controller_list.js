angular.module('starter.controllers').controller('ListCtrl', function($scope, Database, $timeout) {
  $scope.listData = [];
  $scope.allData = [];

  $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
    if (Database.hasListDataChanged() === true) {
      Database.all(function(allData) {
          $scope.listData = [];
          $scope.allData = allData.slice().reverse();
          console.log("Callback onDataReady");
          Database.gotListData();
          //$scope.noMoreItemsAvailable = false;
          //$scope.loadMore();

          createDateGroups();
      }); 
    }
  });

  $scope.noMoreItemsAvailable = false;

  $scope.loadMore = function() {
    console.log("Load more");
    
    if ($scope.allData.length > 0) {
      console.log("Increase, elements left: " + $scope.allData.length);
      $timeout(function() {
        var newElements = 5;
        if ($scope.allData.length < 5) {
          newElements = $scope.allData.length;
        }
        console.log("New elements: " + newElements);
        var tmp = $scope.allData.splice(0, newElements);
        for (var i = 0; i < 5; i++) {
          // check if element is undefined, happens because of strange splice error
          if (tmp[i]) {
            $scope.listData.push(tmp[i]);
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }    
    else {
      $timeout(function() {
        console.log("Nothing left!!!!");
        $scope.noMoreItemsAvailable = true;
      });  
    }  
  };

  var createDateGroups = function() {
    $scope.groups = [];
    var tmpGroups = [];

    // new date object

    for (var i = 0, y = $scope.allData.length; i < y; i++) {
      addInArray(tmpGroups, $scope.allData[i].date.toString().substring(0,10), $scope.allData[i]);
    }
    $scope.groups = tmpGroups;
  };

  var addInArray = function(pArray, utcDate, element) {
    var isNew = true;
    for (var j = 0, k = pArray.length; j < k; j++) {
      if (pArray[j].date === utcDate) {
        isNew = false;
        break;
      }
    }

    if (isNew) {
      pArray.push({
        date: utcDate,
        items: [element]
      });
    }
    else {
      pArray[j].items.push(element);
    }
  };

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

})

.controller('FriendDetailCtrl', function($scope, $stateParams, Database, $ionicNavBarDelegate, $state) {
  $scope.element = Database.get($stateParams.friendId);

  $scope.deleteElement = function() {
  	Database.deleteElement($scope.element.id);
    $state.go('tab.list');
  };
});