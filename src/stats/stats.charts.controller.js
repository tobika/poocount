angular.module('starter.controllers').controller('StatsChartsController', function($scope, Database, $timeout, $translate, SettingsService, $ionicLoading, AnalyticsService) {

    var vm = this;

    $scope.$on("$ionicView.beforeEnter", function() {
        $ionicLoading.show({
            template: 'Loading...'
        });

        AnalyticsService.trackView('Stats');

        SettingsService.getShowDiarrhea().then(function(value) {
            if (value) {
                vm.showDiarrhea = value;
            }
        });

        //if (Database.hasChanged('stats') === true) {
        Database.all(function(allData) {
            $timeout(function() {
                vm.allData = allData;
                Database.gotData('stats');
                calulateChartData(allData);
            });
        });
        //}
    });

    var calulateChartData = function(chartData) {
        var finalData = [], bloodData = [], diarrheaData = [];

        for (var i = 0, y = chartData.length; i < y; i++) {
            chartData[i].date = new Date(chartData[i].date);
            var utcDate = Date.UTC(chartData[i].date.getFullYear(),(chartData[i].date.getMonth()),chartData[i].date.getDate());

            if (chartData[i].type != 'poo') {
                continue;
            }

            addInArray(finalData,utcDate,1);
            addInArray(bloodData,utcDate,chartData[i].blood);

            if( vm.showDiarrhea) {
                if (angular.isUndefined(chartData[i].diarrhea)) {
                    chartData[i].diarrhea = 0;
                }
                addInArray(diarrheaData,utcDate,chartData[i].diarrhea);
            }

        }

        $translate(["POO","add_BLOOD","add_DIARRHEA"]).then(function successFn(translations) {
            drawChart(finalData, bloodData, diarrheaData, translations);
            $ionicLoading.hide();
        });
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

    var drawChart = function(finalData, bloodData, diarrheaData, translations) {
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
                name: translations.POO,
                type: 'areaspline',
                // Define the data points. All series have a dummy year
                // of 1970/71 in order to be compared on the same x axis. Note
                // that in JavaScript, months start at 0 for January, 1 for February etc.
                data: finalData
            },
                {
                    name: translations.add_BLOOD,
                    // Define the data points. All series have a dummy year
                    // of 1970/71 in order to be compared on the same x axis. Note
                    // that in JavaScript, months start at 0 for January, 1 for February etc.
                    data: bloodData,
                    color: '#EF473A'
                },
                {
                    name: translations.add_DIARRHEA,
                    // Define the data points. All series have a dummy year
                    // of 1970/71 in order to be compared on the same x axis. Note
                    // that in JavaScript, months start at 0 for January, 1 for February etc.
                    data: diarrheaData,
                    color: '#FFC900'
                }]
        });
    };

});