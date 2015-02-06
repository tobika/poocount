poomodule.controller('StatsCtrl', function($scope, Database, $timeout) {
  $scope.$on("$ionicView.enter", function( scopes, states ) {
     if (Database.hasStatsDataChanged() === true) {
      Database.all(function(allData) {
        $timeout(function() {
          $scope.allData = allData;
          Database.gotStatsData();
          calulateChartData(allData);
        });
      }); 
    }
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

});