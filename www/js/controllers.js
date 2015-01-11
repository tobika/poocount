angular.module('starter.controllers', [])

.controller('AddCtrl', function($scope, Database, $ionicPlatform) {
	$scope.element = { date : moment().format('DD/MM/YYYY'), time : moment().format('HH:mm') };
	
	$scope.add = function() {
		var element = $scope.element;

		element.date = moment.utc(element.date + " " + element.time, "DD/MM/YYYY HH:mm").toDate();

		console.log(element);
		Database.add(element);
		$scope.element = { date : moment($scope.element.date).format('DD/MM/YYYY'), time : $scope.element.time, type : $scope.element.type, blood : $scope.element.blood};
	
	};
  
  $scope.desktop = !ionic.Platform.isWebView();//!$ionicPlatform.isWebView();
	
	$scope.options = {
	  format: 'dd/mm/yyyy', // ISO formatted date
    //clear: null,
	  //container: 'body',
	  onClose: function(e) {
	    // do something when the picker closes   
	  }
	};

	$scope.optionsTime = {
	  format: 'HH:i', // ISO formatted date
	  onClose: function(e) {
	    // do something when the picker closes   
	  }
	};

  $scope.today = function() {
    $scope.element.date = moment().format('DD/MM/YYYY');
  };
  $scope.now = function() {
    $scope.element.time = moment().format('HH:mm');
  };

	$scope.setType = function(type) {
		$scope.element.type = type;
	};
  $scope.setBlood = function(blood) {
    $scope.element.blood = blood;
  };
	$scope.isSelected = function(type) {
		console.log("isSelected");
		if (type == $scope.element.type) {
			return true;
		}
		return false;
	};

	$scope.convertToDate = function (stringDate){
	  return "moment(stringDate).format('DD/MM/YYYY')";
	};

})

.controller('StatsCtrl', function($scope, Database, $timeout) {

  Database.all(function(allData) {
  	$timeout(function() {
	  	$scope.allData = allData;
	  	console.log("Callback onDataReady");

	  	calulateChartData(allData);
  	});
  });  

  $scope.$on("$ionicView.enter", function( scopes, states ) {
    Database.all(function(allData) {
      $timeout(function() {
        $scope.allData = allData;
        console.log("Callback onDataReady");

        calulateChartData(allData);
      });
    });  
  });

  var calulateChartData =function(chartData) {
  	var finalData = [], bloodData = [];

  	for (var i = 0, y = chartData.length; i < y; i++) {
  		chartData[i].date = new Date(chartData[i].date);
  		var utcDate = Date.UTC(chartData[i].date.getFullYear(),(chartData[i].date.getMonth()),chartData[i].date.getDate());

      if (chartData[i].type != 'poo') {
        continue;
      }	  		

      addInArray(finalData,utcDate,1);
      addInArray(bloodData,utcDate,chartData[i].blood);
      
  	}

  	drawChart(finalData, bloodData);
  };

  var addInArray = function(pArray, utcDate, augmentValue) {
    var isNew = true;
      for (var j = 0, k = pArray.length; j < k; j++) {
        if (pArray[j][0] === utcDate) {
          isNew = false;
          break;
        }
      }

      if (isNew) {
        pArray.push([utcDate,augmentValue]);
      }
      else {
        pArray[j][1] = pArray[j][1] + augmentValue;
      } 
  };

  var drawChart = function(finalData, bloodData) {
  	new Highcharts.Chart({
        chart: {
            renderTo : 'container',
            type: 'spline',
            zoomType: 'x'
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: ''
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            allowDecimals: false,
            min: 0
        },
        legend: {
            enabled: true
        },
        series: [{
            name: 'Poos',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            data: finalData
        },
        {
            name: 'Blood',
            // Define the data points. All series have a dummy year
            // of 1970/71 in order to be compared on the same x axis. Note
            // that in JavaScript, months start at 0 for January, 1 for February etc.
            data: bloodData,
            color: '#FF0000'
        }]
    });
  };

})

.controller('ListCtrl', function($scope, Database, $timeout) {
  // Database.all(function(allData) {
  //   $timeout(function() {
  //     $scope.allData = allData;
  //     console.log("Callback onDataReady");
  //   });
  // });  

  $scope.$on("$ionicView.enter", function( scopes, states ) {
    Database.all(function(allData) {
    $timeout(function() {
      $scope.allData = allData;
      console.log("Callback onDataReady");
    });
  }); 
  });

})

.controller('FriendDetailCtrl', function($scope, $stateParams, Database, $ionicNavBarDelegate) {
  $scope.element = Database.get($stateParams.friendId);

  $scope.deleteElement = function() {
  	Database.deleteElement($scope.element.id);
  	$ionicNavBarDelegate.back();
  };
})

.controller('AccountCtrl', function($scope, Database) {
  $scope.deleteAll = function() {
    Database.deleteAll();
  };
});
