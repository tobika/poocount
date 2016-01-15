// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in service_database.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'templates', 'ngCordova', 'starter.controllers', 'starter.services', 'angular-datepicker', 'pascalprecht.translate'])

.run(function($ionicPlatform, $translate, SettingsService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    //console.log(ionic.Platform.isWebView());
    console.log("Cordova ready");

    if ( navigator && navigator.splashscreen) {
      navigator.splashscreen.hide();
      console.log("Hide splashscreen");
    }


    SettingsService.initSettings().then( function() {
      console.log("language initialized");

      var lang = SettingsService.getLanguage();
      console.log("language: " + lang);
      if (lang.length > 0) {
        console.log("Set preset language");
        $translate.use(lang);
      }
      else if (typeof navigator.globalization !== "undefined") {
      console.log("Use globalization plugin");
      navigator.globalization.getLocaleName(
        function (locale) {
          console.log('locale: ' + locale.value + '\n');
          lang = locale.value.split("-")[0];
          $translate.use(lang).then(function(data) {
            SettingsService.setLanguage(lang);
              console.log("SUCCESS -> " + data);
          }, function(error) {
              console.log("ERROR -> " + error);
          });
        },
        function () {
          console.log('Error getting locale\n');
        }
      );

      console.log("End use of globalization plugin");
    }
    else {
      console.log("No globalization plugin");
    }

    });

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(['$compileProvider', function ($compileProvider) {
  // only use this in production build
  $compileProvider.debugInfoEnabled(false);
}]);

angular.module('starter.services', ['ngCordova']);

angular.module('starter.controllers', ['pascalprecht.translate']);

angular.module('starter').config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.tabs.position("top");
    //ionicConfigProvider.views.maxCache(0);

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "tabs.html",
            controller: 'TabCtrl'
        })

        // Each tab has its own nav history stack:

        .state('tab.add', {
            url: '/add',
            views: {
                'tab-add': {
                    templateUrl: 'tab-new.html',
                    controller: 'AddCtrl'
                }
            }
        })

        .state('tab.stats', {
            url: '/stats',
            views: {
                'tab-stats': {
                    templateUrl: 'tab-stats.html',
                    controller: 'StatsCtrl'
                }
            }
        })
        .state('tab.stats-charts', {
            url: '/stats/charts',
            views: {
                'tab-stats': {
                    templateUrl: 'stats-charts.html',
                    controller: 'StatsChartsCtrl'
                }
            }
        })
        .state('tab.list', {
            url: '/list',
            views: {
                'tab-list': {
                    templateUrl: 'tab-list.html',
                    controller: 'ListCtrl',
                    resolve: {
                        message: function (ListService) {
                            return ListService.initListService();
                        }
                    }
                }
            }
        })
        .state('tab.list-day', {
            url: '/listday/:dayId',
            views: {
                'tab-list': {
                    templateUrl: 'list-day.html',
                    controller: 'ListDetailDayCtrl'
                }
            }
        })
        .state('tab.list-detail', {
            url: '/list/:friendId',
            views: {
                'tab-list': {
                    templateUrl: 'list-detail.html',
                    controller: 'FriendDetailCtrl'
                }
            }
        })
        .state('tab.settings', {
            url: '/settings',
            views: {
                'tab-settings': {
                    templateUrl: 'tab-settings.html',
                    controller: 'SettingsCtrl'
                }
            }
        })
        .state('tab.settings-languages', {
            url: '/settings/languages',
            views: {
                'tab-settings': {
                    templateUrl: 'settings-languages.html',
                    controller: 'SettingsLanguagesCtrl'
                }
            }
        })
        .state('tab.settings-backup', {
            url: '/settings/backup',
            views: {
                'tab-settings': {
                    templateUrl: 'settings-backup.html',
                    controller: 'SettingsBackupCtrl'
                }
            }
        })
        .state('tab.settings-developer', {
            url: '/settings/developer',
            views: {
                'tab-settings': {
                    templateUrl: 'settings-developer.html',
                    controller: 'SettingsDeveloperCtrl'
                }
            }
        })
        .state('tab.settings-help', {
            url: '/settings/help',
            views: {
                'tab-settings': {
                    templateUrl: 'settings-help.html'
                }
            }
        });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/add');

});
angular.module('starter').config(function ($translateProvider) {

  $translateProvider.useStaticFilesLoader({
    prefix: 'locales/locale-',
    suffix: '.json'
  });

  $translateProvider.fallbackLanguage('en');

  $translateProvider.registerAvailableLanguageKeys(['en', 'fr', 'de'], {
    'en_US': 'en',
    'en_UK': 'en',
    'fr_FR': 'fr',
    'de_DE': 'de',
    'de_CH': 'de'
  });

  $translateProvider.determinePreferredLanguage();

});
angular.module('starter.controllers').controller('AddCtrl', function ($scope, Database, SettingsService) {

    $scope.element = {date: moment().format('DD/MM/YYYY'), time: moment().format('HH:mm')};

    $scope.$on("$ionicView.beforeEnter", function (scopes, states) {

         SettingsService.getShowDiarrhea().then(function(value) {
            if (value) {
                $scope.showDiarrhea = value;
            }
        });
    });

    $scope.add = function () {

        var element = $scope.element;

        // check if there is no timezone problem anymore, before it was moment.utc
        element.date = moment(element.date + " " + element.time, "DD/MM/YYYY HH:mm").toDate();

        console.log(element);
        Database.add(element);
        $scope.element = {
            date: moment($scope.element.date).format('DD/MM/YYYY'),
            time: $scope.element.time,
            type: $scope.element.type,
            blood: $scope.element.blood
        };

        if ($scope.showDiarrhea) {

            $scope.element.diarrhea = element.diarrhea;
        }

        if (window.plugins) {

            window.plugins.toast.show('New entry added: ' + element.date.toString(), 'long', 'bottom',
                function (a) {
                    console.log('toast success: ' + a);
                },
                function (b) {
                    alert('toast error: ' + b);
                });
        }
    };

    $scope.desktop = !ionic.Platform.isWebView();//!$ionicPlatform.isWebView();

    $scope.options = {
        format: 'dd/mm/yyyy', // ISO formatted date
        //clear: null,
        //container: 'body',
        onClose: function (e) {
            // do something when the picker closes
        }
    };

    $scope.optionsTime = {
        format: 'HH:i', // ISO formatted date
        onClose: function (e) {
            // do something when the picker closes
        }
    };

    $scope.today = function () {

        $scope.element.date = moment().format('DD/MM/YYYY');
    };
    $scope.now = function () {

        $scope.element.time = moment().format('HH:mm');
    };

    $scope.setType = function (type) {

        $scope.element.type = type;
    };

    $scope.setBlood = function (blood) {

        $scope.element.blood = blood;
    };

    $scope.setDiarrhea = function (diarrhea) {

        $scope.element.diarrhea = diarrhea;
    };

    $scope.isSelected = function (type) {
        // TODO simplify
        console.log("isSelected");
        if (type == $scope.element.type) {
            return true;
        }
        return false;
    };

    $scope.convertToDate = function (stringDate) {

        return "moment(stringDate).format('DD/MM/YYYY')";
    };

});
angular.module('starter.controllers').controller('ListCtrl', function($scope, Database, $timeout, ListService) {
  $scope.listData = [];
  $scope.allData = [];

  $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {

    if (Database.hasChanged('listController') === true) {

      $scope.groups = ListService.getDaysList();
      Database.gotData('listController');
    }
  });

})

.controller('ListDetailDayCtrl', function($scope, $stateParams, ListService) {

  $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
    ListService.initListService().then(function() {
      $scope.listData = ListService.getDayList($stateParams.dayId);
      console.log(JSON.stringify($scope.listData));
    });
  });
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Database, $ionicHistory) {

  $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
    $scope.element = Database.get($stateParams.friendId);
  });

  $scope.deleteElement = function() {

  	Database.deleteElement($scope.element.id);
    $ionicHistory.goBack();
  };
});
angular.module('starter.controllers').controller('SettingsCtrl', function($scope, SettingsService) {
  SettingsService.getShowDiarrhea().then(function(value) {
    if (value) {
      $scope.showDiarrhea = value;
    }
  });

  $scope.showDiarrheaChange = function (value) {
    SettingsService.setShowDiarrhea(value);
  };
});
angular.module('starter.controllers').controller('SettingsBackupCtrl', function($scope, BackupService, $ionicActionSheet) {

  $scope.exportBackup = function() {
    BackupService.exportBackup().then(function() {
      $scope.getBackupFiles();
    });

  };

  $scope.getBackupFiles = function() {
    BackupService.getBackupFiles().then( function(results) {
      console.log(JSON.stringify(results));
      $scope.backupFiles = results;
    }, function() {
      console.log("Backupfiles: Error accessing filesystem.");
    });
  };

  $scope.showActionSheetImport = function(backupFileId) {
   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: 'Import Backup' }
     ],
     destructiveText: 'Delete',
     titleText: $scope.backupFiles[backupFileId].name,
     cancelText: 'Cancel',
     buttonClicked: function(index) {
       BackupService.importBackup($scope.backupFiles[backupFileId].nativeURL);
       return true;
     },
     destructiveButtonClicked: function() {
       BackupService.deleteBackupFile($scope.backupFiles[backupFileId].nativeURL);
       $scope.getBackupFiles();
       return true;
     }
   });
  };

  $scope.$on("$ionicView.enter", function() {
    $scope.getBackupFiles();
  });

});
angular.module('starter.controllers').controller('SettingsDeveloperCtrl', function($scope, Database, $translate) {
  $scope.deleteAll = function() {
    $translate('settings_CONFIRMDELETE').then(function successFn(translation) {
        var result = confirm(translation);

        if (result ) {
            Database.deleteAll();
        }
    }, function errorFn(translationId) {
      console.log('Translation failed:', translationId);
    });
  };

  $scope.createDemoData = function() {
    var result = confirm("Attention: Creating demo data will delete all your own data.");

    if (result ) {
      Database.createDemoData();
    }
  };

});
angular.module('starter.controllers').controller('SettingsLanguagesCtrl', function($scope, Database, $translate, SettingsService) {
  $scope.setLanguage = function(lang) {
    console.log("Set language: " + lang);
    $translate.use(lang);
    SettingsService.setLanguage(lang);
  };
});
angular.module('starter.controllers').controller('StatsCtrl', function($scope, Database, $timeout, $translate, SettingsService) {

    $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
        //alert('fuh');
    });
});
angular.module('starter.controllers').controller('StatsChartsCtrl', function($scope, Database, $timeout, $translate, SettingsService, $ionicLoading) {

  $scope.$on("$ionicView.beforeEnter", function() {
      $ionicLoading.show({
          template: 'Loading...'
      });
     $scope.showDiarrhea = SettingsService.getShowDiarrhea();
     //if (Database.hasChanged('stats') === true) {
      Database.all(function(allData) {
        $timeout(function() {
          $scope.allData = allData;
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

      if( $scope.showDiarrhea) {
        if (typeof chartData[i].diarrhea == "undefined") {
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
angular.module('starter.controllers').controller('TabCtrl', function($scope, Database) {

  $scope.$on("$ionicView.beforeEnter", function( scopes, states ) {
    Database.lastEntry(function(lastEntry) {
      $scope.lastEntry = lastEntry;
    });
  });
});
angular.module('starter.services').factory('BackupService', function($q, $cordovaFile, Database) {
  var backupFiles = [];

  return {
    getBackupFiles: function() {
      var deferred = $q.defer();

      if (cordova && cordova.file && cordova.file.externalRootDirectory && window.resolveLocalFileSystemURL) {
        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
          console.log("Get filelist");
          var dirReader = dir.createReader();

          dirReader.readEntries (function(results) {
            backupFiles = [];

            //console.log(JSON.stringify(results));
            for (var i = 0; i < results.length; i++) {
              if (results[i].name.indexOf("Poocount") >= 0) {
                //console.log(results[i].name);
                backupFiles.push({name: results[i].name, nativeURL: results[i].nativeURL});
              }
            }

            deferred.resolve(backupFiles);
          });

        });
      }
      else {
        deferred.reject();
      }

      return deferred.promise;

    },
    exportBackup: function() {
      var deferred = $q.defer();

      window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
        console.log("Export: goto sdcard",dir);
        dir.getFile("PoocountBackup_" + moment(new Date()).format("YYYYMMDD_hhmmss") + ".txt", {create:true}, function(file) {
          console.log("create file", file);
          
          file.createWriter(function(fileWriter) {

            // use to append
            //fileWriter.seek(fileWriter.length);

            Database.all(function(allData) {

              var exportObject = {};
              exportObject.poocountDBVersion = 0;
              exportObject.data = allData;

              var blob = new Blob([JSON.stringify(exportObject)], {type:'text/plain'});
              fileWriter.write(blob);
              console.log("File wrote");
              deferred.resolve();
            }); 

          }, function(error) {
            console.log("Error: " + JSON.stringify(error));
            deferred.reject(error);
          });

        });
      });

      return deferred.promise;
    },
    importBackup: function(fileURI) {
      var deferred = $q.defer();

      window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {

        fileEntry.file(function(file) {
           var reader = new FileReader();

          reader.onloadend = function(e) {
            var importedData = JSON.parse(reader.result);
            console.log("Filedata: " + JSON.stringify(importedData));

            Database.importData(importedData.data);
            deferred.resolve();
          };
          reader.onerror = function(e) {
            console.log("Error: " + JSON.stringify(e));
            deferred.reject(e);
          };

          reader.readAsText(file);
        });

    });

      return deferred.promise;
    },
    deleteBackupFile: function(fileURI) {
      var deferred = $q.defer();

      window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {

        fileEntry.remove(function() {
          console.log('File removed.');
          deferred.resolve();
        }, function(e) {
          console.log("Error: " + JSON.stringify(e));
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }
  };
});
angular.module('starter.services').factory('Database', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var allData = [],
  onReady = null,
  onReadyLast = null,
  lastId = 0,
  hasChangedData = {};
  that = this;

  localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: 'poocountStorage'
  });

  localforage.getItem('allData').then(function(value) {
    // The same code, but using ES6 Promises.
    if (value) {
      allData = value;
      //console.log(JSON.stringify(value));
      if (onReady) {
        onReady(allData);
      }
      if (onReadyLast) {
        onReadyLast(getLastEntry());
      }
    }
  });

  localforage.getItem('lastId').then(function(value) {
    // The same code, but using ES6 Promises.
    if (value) {
      lastId = value;
    }
    else {
      lastId = 0;
    }
  });

  var saveToLocalStorage = function() {
    allData =  _.sortBy(allData, function(elm){ return elm.date; });
    localforage.setItem('allData', allData);
    localforage.setItem('lastId', lastId);
    dataChanged();
    if (onReadyLast) {
      onReadyLast(getLastEntry());
    }
  };

  var getNewId = function() {
    if (allData.length === 0) {
      lastId = 1;
    }
    else {
      lastId++;
    }

    return lastId;
  };

  var getIndexFromId = function(dataId) {
    for (var i = 0, y = allData.length; i < y; i++) {
      if (allData[i].id == dataId) {
        return i;
      }
    }

    console.log("Index not found: " + dataId);
    return -1;
  };

  var dataChanged = function() {

    for (var param in hasChangedData) {
      hasChangedData[param] = true;
    }
  };

  var getLastEntry = function() {
    return allData[allData.length-1];
  };

  return {
    all: function(cb) {
      onReady = cb;
      if(onReady) {
        onReady(allData);
      }
    },
    lastEntry: function(cb) {
      onReadyLast = cb;
      if(onReadyLast) {
        onReadyLast(getLastEntry());
      }
    },
    get: function(dataId) {
      var index = getIndexFromId(dataId);
      if (index >= 0) {
        return allData[index];
      }

      return null;
    },
    deleteElement: function(dataId) {
      console.log("Delete: " + dataId);
      var index = getIndexFromId(dataId);
      if (index >= 0) {
        allData.splice(index,1);
        saveToLocalStorage();
      }
    },
    deleteAll: function() {
      console.log("Delete all");
      allData = [];
      dataChanged();
      localforage.clear();
    },
    add: function(newEntry) {
      newEntry.id = getNewId();
      allData.push(newEntry);
      console.log(newEntry.id);
      saveToLocalStorage();
    },
    edit: function(dataId, editEntry) {
      var index = getIndexFromId(dataId);
      if (index >= 0) {
        allData[index] = editEntry;
        saveToLocalStorage();
      }
    },
    hasChanged: function(child) {
      if (typeof hasChangedData[child] !== 'undefined') {
        return hasChangedData[child];
      }
      return true;
    },
    gotData: function(child) {
      hasChangedData[child] = false;
    },
    importData: function(importedData) {
      allData = importedData;
      lastId = _.sortBy(importedData, function(elm){ return elm.id; })[importedData.length-1].id;
      console.log("lastId after import: " + lastId);
      saveToLocalStorage();
    },
    createDemoData: function() {
      allData = [];
      var currentDate = new Date();
      var entrysPerDay = 4;

      for(var i=0; i<360; i++) {
        var newEntrysPerDay = Math.random() * (7 - 1) + 1;
        if (newEntrysPerDay > entrysPerDay) {
          entrysPerDay++;
        }
        else if (newEntrysPerDay < entrysPerDay) {
          entrysPerDay--;
        }

        for(var j=0; j<entrysPerDay; j++) {
          //console.log(new Date(currentDate));
          //var newDate = moment(currentDate + " " + "08:30", "MM/DD/YYYY HH:mm").toDate();
          allData.push({ id : getNewId(), date : moment(new Date(currentDate)).toDate(), time : "08:30", type : "poo", blood : Math.floor(Math.random() * 2), diarrhea : Math.floor(Math.random() * 2)});

        }
        currentDate.setDate(currentDate.getDate() - 1);
      }

      saveToLocalStorage();
    }
  };
});
angular.module('starter.services').factory('ListService', function(Database, $q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var allData = [],
    groups = [],
    loaded = false;
    that = this;

  var createDateGroups = function(allData) {
    var tmpGroups = [];

    for (var i = 0, y = allData.length; i < y; i++) {
      allData[i].date = new Date(allData[i].date);
      addInArray(tmpGroups, moment(allData[i].date).format('DD/MM/YYYY'), moment(allData[i].date).toDate(), allData[i]);
    }

    that.groups = tmpGroups;
  };

  var addInArray = function(pArray, checkDate, date, element) {
    var isNew = true;
    for (var j = 0, k = pArray.length; j < k; j++) {
      if (pArray[j].checkDate === checkDate) {
        isNew = false;
        break;
      }
    }

    if (isNew) {
      pArray.push({
        checkDate: checkDate,
        date: date,
        poo: element.type == 'poo' ? 1 : 0,
        notes: element.type == 'note' ? 1 : 0,
        blood: element.blood,
        items: [element]
      });
    }
    else {
      pArray[j].blood += element.blood;
      if (element.type == 'poo') {
        pArray[j].poo += 1;
      }
      else if (element.type == 'note') {
        pArray[j].notes += 1;
      }
      pArray[j].items.push(element);
    }
  };


  var initListService = function() {
    var deferred = $q.defer();

    if (!loaded || Database.hasChanged('listService')) {
      Database.all(function(allData) {
        allData = allData.slice().reverse();
        console.log("Callback onDataReady for list service", allData);

        if(allData.length > 0) {
          createDateGroups(allData);
        }

        loaded = true;
        Database.gotData('listService');

        deferred.resolve();
      });
    }
    else {
      deferred.resolve();
    }


    return deferred.promise;
  };

  return {
    initListService: initListService,
    getDaysList: function() {
      return that.groups;
    },
    getDayList: function(index) {
      return that.groups[index];
    }
  };
});
angular.module('starter.services').factory('SettingsService', function($q) {
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
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZ19yb3V0ZXMuanMiLCJjb25maWdfdHJhbnNsYXRpb24uanMiLCJjb250cm9sbGVyX2FkZC5qcyIsImNvbnRyb2xsZXJfbGlzdC5qcyIsImNvbnRyb2xsZXJfc2V0dGluZ3MuanMiLCJjb250cm9sbGVyX3NldHRpbmdzX2JhY2t1cC5qcyIsImNvbnRyb2xsZXJfc2V0dGluZ3NfZGV2ZWxvcGVyLmpzIiwiY29udHJvbGxlcl9zZXR0aW5nc19sYW5ndWFnZXMuanMiLCJjb250cm9sbGVyX3N0YXRzLmpzIiwiY29udHJvbGxlcl9zdGF0c19jaGFydHMuanMiLCJjb250cm9sbGVyX3RhYi5qcyIsInNlcnZpY2VfYmFja3VwLmpzIiwic2VydmljZV9kYXRhYmFzZS5qcyIsInNlcnZpY2VfbGlzdC5qcyIsInNlcnZpY2Vfc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSW9uaWMgU3RhcnRlciBBcHBcblxuLy8gYW5ndWxhci5tb2R1bGUgaXMgYSBnbG9iYWwgcGxhY2UgZm9yIGNyZWF0aW5nLCByZWdpc3RlcmluZyBhbmQgcmV0cmlldmluZyBBbmd1bGFyIG1vZHVsZXNcbi8vICdzdGFydGVyJyBpcyB0aGUgbmFtZSBvZiB0aGlzIGFuZ3VsYXIgbW9kdWxlIGV4YW1wbGUgKGFsc28gc2V0IGluIGEgPGJvZHk+IGF0dHJpYnV0ZSBpbiBpbmRleC5odG1sKVxuLy8gdGhlIDJuZCBwYXJhbWV0ZXIgaXMgYW4gYXJyYXkgb2YgJ3JlcXVpcmVzJ1xuLy8gJ3N0YXJ0ZXIuc2VydmljZXMnIGlzIGZvdW5kIGluIHNlcnZpY2VfZGF0YWJhc2UuanNcbi8vICdzdGFydGVyLmNvbnRyb2xsZXJzJyBpcyBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInLCBbJ2lvbmljJywgJ3RlbXBsYXRlcycsICduZ0NvcmRvdmEnLCAnc3RhcnRlci5jb250cm9sbGVycycsICdzdGFydGVyLnNlcnZpY2VzJywgJ2FuZ3VsYXItZGF0ZXBpY2tlcicsICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0sICR0cmFuc2xhdGUsIFNldHRpbmdzU2VydmljZSkge1xuICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgIC8vY29uc29sZS5sb2coaW9uaWMuUGxhdGZvcm0uaXNXZWJWaWV3KCkpO1xuICAgIGNvbnNvbGUubG9nKFwiQ29yZG92YSByZWFkeVwiKTtcblxuICAgIGlmICggbmF2aWdhdG9yICYmIG5hdmlnYXRvci5zcGxhc2hzY3JlZW4pIHtcbiAgICAgIG5hdmlnYXRvci5zcGxhc2hzY3JlZW4uaGlkZSgpO1xuICAgICAgY29uc29sZS5sb2coXCJIaWRlIHNwbGFzaHNjcmVlblwiKTtcbiAgICB9XG5cblxuICAgIFNldHRpbmdzU2VydmljZS5pbml0U2V0dGluZ3MoKS50aGVuKCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibGFuZ3VhZ2UgaW5pdGlhbGl6ZWRcIik7XG5cbiAgICAgIHZhciBsYW5nID0gU2V0dGluZ3NTZXJ2aWNlLmdldExhbmd1YWdlKCk7XG4gICAgICBjb25zb2xlLmxvZyhcImxhbmd1YWdlOiBcIiArIGxhbmcpO1xuICAgICAgaWYgKGxhbmcubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlNldCBwcmVzZXQgbGFuZ3VhZ2VcIik7XG4gICAgICAgICR0cmFuc2xhdGUudXNlKGxhbmcpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodHlwZW9mIG5hdmlnYXRvci5nbG9iYWxpemF0aW9uICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlVzZSBnbG9iYWxpemF0aW9uIHBsdWdpblwiKTtcbiAgICAgIG5hdmlnYXRvci5nbG9iYWxpemF0aW9uLmdldExvY2FsZU5hbWUoXG4gICAgICAgIGZ1bmN0aW9uIChsb2NhbGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnbG9jYWxlOiAnICsgbG9jYWxlLnZhbHVlICsgJ1xcbicpO1xuICAgICAgICAgIGxhbmcgPSBsb2NhbGUudmFsdWUuc3BsaXQoXCItXCIpWzBdO1xuICAgICAgICAgICR0cmFuc2xhdGUudXNlKGxhbmcpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgU2V0dGluZ3NTZXJ2aWNlLnNldExhbmd1YWdlKGxhbmcpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlNVQ0NFU1MgLT4gXCIgKyBkYXRhKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVSUk9SIC0+IFwiICsgZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGdldHRpbmcgbG9jYWxlXFxuJyk7XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiRW5kIHVzZSBvZiBnbG9iYWxpemF0aW9uIHBsdWdpblwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIk5vIGdsb2JhbGl6YXRpb24gcGx1Z2luXCIpO1xuICAgIH1cblxuICAgIH0pO1xuXG4gICAgaWYod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhcih0cnVlKTtcbiAgICB9XG5cbiAgICBpZih3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XG4gICAgfVxuICB9KTtcbn0pXG5cbi5jb25maWcoWyckY29tcGlsZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRjb21waWxlUHJvdmlkZXIpIHtcbiAgLy8gb25seSB1c2UgdGhpcyBpbiBwcm9kdWN0aW9uIGJ1aWxkXG4gICRjb21waWxlUHJvdmlkZXIuZGVidWdJbmZvRW5hYmxlZChmYWxzZSk7XG59XSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLnNlcnZpY2VzJywgWyduZ0NvcmRvdmEnXSk7XG5cbmFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJywgWydwYXNjYWxwcmVjaHQudHJhbnNsYXRlJ10pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInKS5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGlvbmljQ29uZmlnUHJvdmlkZXIpIHtcblxuICAgICRpb25pY0NvbmZpZ1Byb3ZpZGVyLnRhYnMucG9zaXRpb24oXCJ0b3BcIik7XG4gICAgLy9pb25pY0NvbmZpZ1Byb3ZpZGVyLnZpZXdzLm1heENhY2hlKDApO1xuXG4gICAgLy8gSW9uaWMgdXNlcyBBbmd1bGFyVUkgUm91dGVyIHdoaWNoIHVzZXMgdGhlIGNvbmNlcHQgb2Ygc3RhdGVzXG4gICAgLy8gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS91aS1yb3V0ZXJcbiAgICAvLyBTZXQgdXAgdGhlIHZhcmlvdXMgc3RhdGVzIHdoaWNoIHRoZSBhcHAgY2FuIGJlIGluLlxuICAgIC8vIEVhY2ggc3RhdGUncyBjb250cm9sbGVyIGNhbiBiZSBmb3VuZCBpbiBjb250cm9sbGVycy5qc1xuICAgICRzdGF0ZVByb3ZpZGVyXG5cbiAgICAvLyBzZXR1cCBhbiBhYnN0cmFjdCBzdGF0ZSBmb3IgdGhlIHRhYnMgZGlyZWN0aXZlXG4gICAgICAgIC5zdGF0ZSgndGFiJywge1xuICAgICAgICAgICAgdXJsOiBcIi90YWJcIixcbiAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidGFicy5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnVGFiQ3RybCdcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBFYWNoIHRhYiBoYXMgaXRzIG93biBuYXYgaGlzdG9yeSBzdGFjazpcblxuICAgICAgICAuc3RhdGUoJ3RhYi5hZGQnLCB7XG4gICAgICAgICAgICB1cmw6ICcvYWRkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3RhYi1hZGQnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGFiLW5ldy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZEN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgndGFiLnN0YXRzJywge1xuICAgICAgICAgICAgdXJsOiAnL3N0YXRzJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3RhYi1zdGF0cyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0YWItc3RhdHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdGF0c0N0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3RhYi5zdGF0cy1jaGFydHMnLCB7XG4gICAgICAgICAgICB1cmw6ICcvc3RhdHMvY2hhcnRzJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3RhYi1zdGF0cyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0cy1jaGFydHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTdGF0c0NoYXJ0c0N0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3RhYi5saXN0Jywge1xuICAgICAgICAgICAgdXJsOiAnL2xpc3QnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLWxpc3QnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGFiLWxpc3QuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaXN0Q3RybCcsXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGZ1bmN0aW9uIChMaXN0U2VydmljZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBMaXN0U2VydmljZS5pbml0TGlzdFNlcnZpY2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCd0YWIubGlzdC1kYXknLCB7XG4gICAgICAgICAgICB1cmw6ICcvbGlzdGRheS86ZGF5SWQnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLWxpc3QnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlzdC1kYXkuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMaXN0RGV0YWlsRGF5Q3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgndGFiLmxpc3QtZGV0YWlsJywge1xuICAgICAgICAgICAgdXJsOiAnL2xpc3QvOmZyaWVuZElkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3RhYi1saXN0Jzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xpc3QtZGV0YWlsLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRnJpZW5kRGV0YWlsQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgndGFiLnNldHRpbmdzJywge1xuICAgICAgICAgICAgdXJsOiAnL3NldHRpbmdzJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3RhYi1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0YWItc2V0dGluZ3MuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0N0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3RhYi5zZXR0aW5ncy1sYW5ndWFnZXMnLCB7XG4gICAgICAgICAgICB1cmw6ICcvc2V0dGluZ3MvbGFuZ3VhZ2VzJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3RhYi1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzZXR0aW5ncy1sYW5ndWFnZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0xhbmd1YWdlc0N0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3RhYi5zZXR0aW5ncy1iYWNrdXAnLCB7XG4gICAgICAgICAgICB1cmw6ICcvc2V0dGluZ3MvYmFja3VwJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3RhYi1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzZXR0aW5ncy1iYWNrdXAuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0JhY2t1cEN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3RhYi5zZXR0aW5ncy1kZXZlbG9wZXInLCB7XG4gICAgICAgICAgICB1cmw6ICcvc2V0dGluZ3MvZGV2ZWxvcGVyJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3RhYi1zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzZXR0aW5ncy1kZXZlbG9wZXIuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0RldmVsb3BlckN0cmwnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3RhYi5zZXR0aW5ncy1oZWxwJywge1xuICAgICAgICAgICAgdXJsOiAnL3NldHRpbmdzL2hlbHAnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NldHRpbmdzLWhlbHAuaHRtbCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICAvLyBpZiBub25lIG9mIHRoZSBhYm92ZSBzdGF0ZXMgYXJlIG1hdGNoZWQsIHVzZSB0aGlzIGFzIHRoZSBmYWxsYmFja1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy90YWIvYWRkJyk7XG5cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyJykuY29uZmlnKGZ1bmN0aW9uICgkdHJhbnNsYXRlUHJvdmlkZXIpIHtcblxuICAkdHJhbnNsYXRlUHJvdmlkZXIudXNlU3RhdGljRmlsZXNMb2FkZXIoe1xuICAgIHByZWZpeDogJ2xvY2FsZXMvbG9jYWxlLScsXG4gICAgc3VmZml4OiAnLmpzb24nXG4gIH0pO1xuXG4gICR0cmFuc2xhdGVQcm92aWRlci5mYWxsYmFja0xhbmd1YWdlKCdlbicpO1xuXG4gICR0cmFuc2xhdGVQcm92aWRlci5yZWdpc3RlckF2YWlsYWJsZUxhbmd1YWdlS2V5cyhbJ2VuJywgJ2ZyJywgJ2RlJ10sIHtcbiAgICAnZW5fVVMnOiAnZW4nLFxuICAgICdlbl9VSyc6ICdlbicsXG4gICAgJ2ZyX0ZSJzogJ2ZyJyxcbiAgICAnZGVfREUnOiAnZGUnLFxuICAgICdkZV9DSCc6ICdkZSdcbiAgfSk7XG5cbiAgJHRyYW5zbGF0ZVByb3ZpZGVyLmRldGVybWluZVByZWZlcnJlZExhbmd1YWdlKCk7XG5cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIERhdGFiYXNlLCBTZXR0aW5nc1NlcnZpY2UpIHtcblxuICAgICRzY29wZS5lbGVtZW50ID0ge2RhdGU6IG1vbWVudCgpLmZvcm1hdCgnREQvTU0vWVlZWScpLCB0aW1lOiBtb21lbnQoKS5mb3JtYXQoJ0hIOm1tJyl9O1xuXG4gICAgJHNjb3BlLiRvbihcIiRpb25pY1ZpZXcuYmVmb3JlRW50ZXJcIiwgZnVuY3Rpb24gKHNjb3Blcywgc3RhdGVzKSB7XG5cbiAgICAgICAgIFNldHRpbmdzU2VydmljZS5nZXRTaG93RGlhcnJoZWEoKS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd0RpYXJyaGVhID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmFkZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgZWxlbWVudCA9ICRzY29wZS5lbGVtZW50O1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZXJlIGlzIG5vIHRpbWV6b25lIHByb2JsZW0gYW55bW9yZSwgYmVmb3JlIGl0IHdhcyBtb21lbnQudXRjXG4gICAgICAgIGVsZW1lbnQuZGF0ZSA9IG1vbWVudChlbGVtZW50LmRhdGUgKyBcIiBcIiArIGVsZW1lbnQudGltZSwgXCJERC9NTS9ZWVlZIEhIOm1tXCIpLnRvRGF0ZSgpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICBEYXRhYmFzZS5hZGQoZWxlbWVudCk7XG4gICAgICAgICRzY29wZS5lbGVtZW50ID0ge1xuICAgICAgICAgICAgZGF0ZTogbW9tZW50KCRzY29wZS5lbGVtZW50LmRhdGUpLmZvcm1hdCgnREQvTU0vWVlZWScpLFxuICAgICAgICAgICAgdGltZTogJHNjb3BlLmVsZW1lbnQudGltZSxcbiAgICAgICAgICAgIHR5cGU6ICRzY29wZS5lbGVtZW50LnR5cGUsXG4gICAgICAgICAgICBibG9vZDogJHNjb3BlLmVsZW1lbnQuYmxvb2RcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoJHNjb3BlLnNob3dEaWFycmhlYSkge1xuXG4gICAgICAgICAgICAkc2NvcGUuZWxlbWVudC5kaWFycmhlYSA9IGVsZW1lbnQuZGlhcnJoZWE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2luZG93LnBsdWdpbnMpIHtcblxuICAgICAgICAgICAgd2luZG93LnBsdWdpbnMudG9hc3Quc2hvdygnTmV3IGVudHJ5IGFkZGVkOiAnICsgZWxlbWVudC5kYXRlLnRvU3RyaW5nKCksICdsb25nJywgJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RvYXN0IHN1Y2Nlc3M6ICcgKyBhKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCd0b2FzdCBlcnJvcjogJyArIGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5kZXNrdG9wID0gIWlvbmljLlBsYXRmb3JtLmlzV2ViVmlldygpOy8vISRpb25pY1BsYXRmb3JtLmlzV2ViVmlldygpO1xuXG4gICAgJHNjb3BlLm9wdGlvbnMgPSB7XG4gICAgICAgIGZvcm1hdDogJ2RkL21tL3l5eXknLCAvLyBJU08gZm9ybWF0dGVkIGRhdGVcbiAgICAgICAgLy9jbGVhcjogbnVsbCxcbiAgICAgICAgLy9jb250YWluZXI6ICdib2R5JyxcbiAgICAgICAgb25DbG9zZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIC8vIGRvIHNvbWV0aGluZyB3aGVuIHRoZSBwaWNrZXIgY2xvc2VzXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLm9wdGlvbnNUaW1lID0ge1xuICAgICAgICBmb3JtYXQ6ICdISDppJywgLy8gSVNPIGZvcm1hdHRlZCBkYXRlXG4gICAgICAgIG9uQ2xvc2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgd2hlbiB0aGUgcGlja2VyIGNsb3Nlc1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS50b2RheSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAkc2NvcGUuZWxlbWVudC5kYXRlID0gbW9tZW50KCkuZm9ybWF0KCdERC9NTS9ZWVlZJyk7XG4gICAgfTtcbiAgICAkc2NvcGUubm93ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICRzY29wZS5lbGVtZW50LnRpbWUgPSBtb21lbnQoKS5mb3JtYXQoJ0hIOm1tJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZXRUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcblxuICAgICAgICAkc2NvcGUuZWxlbWVudC50eXBlID0gdHlwZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNldEJsb29kID0gZnVuY3Rpb24gKGJsb29kKSB7XG5cbiAgICAgICAgJHNjb3BlLmVsZW1lbnQuYmxvb2QgPSBibG9vZDtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNldERpYXJyaGVhID0gZnVuY3Rpb24gKGRpYXJyaGVhKSB7XG5cbiAgICAgICAgJHNjb3BlLmVsZW1lbnQuZGlhcnJoZWEgPSBkaWFycmhlYTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmlzU2VsZWN0ZWQgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAvLyBUT0RPIHNpbXBsaWZ5XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaXNTZWxlY3RlZFwiKTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJHNjb3BlLmVsZW1lbnQudHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY29udmVydFRvRGF0ZSA9IGZ1bmN0aW9uIChzdHJpbmdEYXRlKSB7XG5cbiAgICAgICAgcmV0dXJuIFwibW9tZW50KHN0cmluZ0RhdGUpLmZvcm1hdCgnREQvTU0vWVlZWScpXCI7XG4gICAgfTtcblxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMaXN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGF0YWJhc2UsICR0aW1lb3V0LCBMaXN0U2VydmljZSkge1xuICAkc2NvcGUubGlzdERhdGEgPSBbXTtcbiAgJHNjb3BlLmFsbERhdGEgPSBbXTtcblxuICAkc2NvcGUuJG9uKFwiJGlvbmljVmlldy5iZWZvcmVFbnRlclwiLCBmdW5jdGlvbiggc2NvcGVzLCBzdGF0ZXMgKSB7XG5cbiAgICBpZiAoRGF0YWJhc2UuaGFzQ2hhbmdlZCgnbGlzdENvbnRyb2xsZXInKSA9PT0gdHJ1ZSkge1xuXG4gICAgICAkc2NvcGUuZ3JvdXBzID0gTGlzdFNlcnZpY2UuZ2V0RGF5c0xpc3QoKTtcbiAgICAgIERhdGFiYXNlLmdvdERhdGEoJ2xpc3RDb250cm9sbGVyJyk7XG4gICAgfVxuICB9KTtcblxufSlcblxuLmNvbnRyb2xsZXIoJ0xpc3REZXRhaWxEYXlDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIExpc3RTZXJ2aWNlKSB7XG5cbiAgJHNjb3BlLiRvbihcIiRpb25pY1ZpZXcuYmVmb3JlRW50ZXJcIiwgZnVuY3Rpb24oIHNjb3Blcywgc3RhdGVzICkge1xuICAgIExpc3RTZXJ2aWNlLmluaXRMaXN0U2VydmljZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUubGlzdERhdGEgPSBMaXN0U2VydmljZS5nZXREYXlMaXN0KCRzdGF0ZVBhcmFtcy5kYXlJZCk7XG4gICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSgkc2NvcGUubGlzdERhdGEpKTtcbiAgICB9KTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignRnJpZW5kRGV0YWlsQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBEYXRhYmFzZSwgJGlvbmljSGlzdG9yeSkge1xuXG4gICRzY29wZS4kb24oXCIkaW9uaWNWaWV3LmJlZm9yZUVudGVyXCIsIGZ1bmN0aW9uKCBzY29wZXMsIHN0YXRlcyApIHtcbiAgICAkc2NvcGUuZWxlbWVudCA9IERhdGFiYXNlLmdldCgkc3RhdGVQYXJhbXMuZnJpZW5kSWQpO1xuICB9KTtcblxuICAkc2NvcGUuZGVsZXRlRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuXG4gIFx0RGF0YWJhc2UuZGVsZXRlRWxlbWVudCgkc2NvcGUuZWxlbWVudC5pZCk7XG4gICAgJGlvbmljSGlzdG9yeS5nb0JhY2soKTtcbiAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2V0dGluZ3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBTZXR0aW5nc1NlcnZpY2UpIHtcbiAgU2V0dGluZ3NTZXJ2aWNlLmdldFNob3dEaWFycmhlYSgpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgICRzY29wZS5zaG93RGlhcnJoZWEgPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gICRzY29wZS5zaG93RGlhcnJoZWFDaGFuZ2UgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBTZXR0aW5nc1NlcnZpY2Uuc2V0U2hvd0RpYXJyaGVhKHZhbHVlKTtcbiAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2V0dGluZ3NCYWNrdXBDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBCYWNrdXBTZXJ2aWNlLCAkaW9uaWNBY3Rpb25TaGVldCkge1xuXG4gICRzY29wZS5leHBvcnRCYWNrdXAgPSBmdW5jdGlvbigpIHtcbiAgICBCYWNrdXBTZXJ2aWNlLmV4cG9ydEJhY2t1cCgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUuZ2V0QmFja3VwRmlsZXMoKTtcbiAgICB9KTtcblxuICB9O1xuXG4gICRzY29wZS5nZXRCYWNrdXBGaWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgIEJhY2t1cFNlcnZpY2UuZ2V0QmFja3VwRmlsZXMoKS50aGVuKCBmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXN1bHRzKSk7XG4gICAgICAkc2NvcGUuYmFja3VwRmlsZXMgPSByZXN1bHRzO1xuICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2coXCJCYWNrdXBmaWxlczogRXJyb3IgYWNjZXNzaW5nIGZpbGVzeXN0ZW0uXCIpO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5zaG93QWN0aW9uU2hlZXRJbXBvcnQgPSBmdW5jdGlvbihiYWNrdXBGaWxlSWQpIHtcbiAgIC8vIFNob3cgdGhlIGFjdGlvbiBzaGVldFxuICAgdmFyIGhpZGVTaGVldCA9ICRpb25pY0FjdGlvblNoZWV0LnNob3coe1xuICAgICBidXR0b25zOiBbXG4gICAgICAgeyB0ZXh0OiAnSW1wb3J0IEJhY2t1cCcgfVxuICAgICBdLFxuICAgICBkZXN0cnVjdGl2ZVRleHQ6ICdEZWxldGUnLFxuICAgICB0aXRsZVRleHQ6ICRzY29wZS5iYWNrdXBGaWxlc1tiYWNrdXBGaWxlSWRdLm5hbWUsXG4gICAgIGNhbmNlbFRleHQ6ICdDYW5jZWwnLFxuICAgICBidXR0b25DbGlja2VkOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgIEJhY2t1cFNlcnZpY2UuaW1wb3J0QmFja3VwKCRzY29wZS5iYWNrdXBGaWxlc1tiYWNrdXBGaWxlSWRdLm5hdGl2ZVVSTCk7XG4gICAgICAgcmV0dXJuIHRydWU7XG4gICAgIH0sXG4gICAgIGRlc3RydWN0aXZlQnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgQmFja3VwU2VydmljZS5kZWxldGVCYWNrdXBGaWxlKCRzY29wZS5iYWNrdXBGaWxlc1tiYWNrdXBGaWxlSWRdLm5hdGl2ZVVSTCk7XG4gICAgICAgJHNjb3BlLmdldEJhY2t1cEZpbGVzKCk7XG4gICAgICAgcmV0dXJuIHRydWU7XG4gICAgIH1cbiAgIH0pO1xuICB9O1xuXG4gICRzY29wZS4kb24oXCIkaW9uaWNWaWV3LmVudGVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5nZXRCYWNrdXBGaWxlcygpO1xuICB9KTtcblxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZXR0aW5nc0RldmVsb3BlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERhdGFiYXNlLCAkdHJhbnNsYXRlKSB7XG4gICRzY29wZS5kZWxldGVBbGwgPSBmdW5jdGlvbigpIHtcbiAgICAkdHJhbnNsYXRlKCdzZXR0aW5nc19DT05GSVJNREVMRVRFJykudGhlbihmdW5jdGlvbiBzdWNjZXNzRm4odHJhbnNsYXRpb24pIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNvbmZpcm0odHJhbnNsYXRpb24pO1xuXG4gICAgICAgIGlmIChyZXN1bHQgKSB7XG4gICAgICAgICAgICBEYXRhYmFzZS5kZWxldGVBbGwoKTtcbiAgICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIGVycm9yRm4odHJhbnNsYXRpb25JZCkge1xuICAgICAgY29uc29sZS5sb2coJ1RyYW5zbGF0aW9uIGZhaWxlZDonLCB0cmFuc2xhdGlvbklkKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuY3JlYXRlRGVtb0RhdGEgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzdWx0ID0gY29uZmlybShcIkF0dGVudGlvbjogQ3JlYXRpbmcgZGVtbyBkYXRhIHdpbGwgZGVsZXRlIGFsbCB5b3VyIG93biBkYXRhLlwiKTtcblxuICAgIGlmIChyZXN1bHQgKSB7XG4gICAgICBEYXRhYmFzZS5jcmVhdGVEZW1vRGF0YSgpO1xuICAgIH1cbiAgfTtcblxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTZXR0aW5nc0xhbmd1YWdlc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIERhdGFiYXNlLCAkdHJhbnNsYXRlLCBTZXR0aW5nc1NlcnZpY2UpIHtcbiAgJHNjb3BlLnNldExhbmd1YWdlID0gZnVuY3Rpb24obGFuZykge1xuICAgIGNvbnNvbGUubG9nKFwiU2V0IGxhbmd1YWdlOiBcIiArIGxhbmcpO1xuICAgICR0cmFuc2xhdGUudXNlKGxhbmcpO1xuICAgIFNldHRpbmdzU2VydmljZS5zZXRMYW5ndWFnZShsYW5nKTtcbiAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3RhdHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEYXRhYmFzZSwgJHRpbWVvdXQsICR0cmFuc2xhdGUsIFNldHRpbmdzU2VydmljZSkge1xuXG4gICAgJHNjb3BlLiRvbihcIiRpb25pY1ZpZXcuYmVmb3JlRW50ZXJcIiwgZnVuY3Rpb24oIHNjb3Blcywgc3RhdGVzICkge1xuICAgICAgICAvL2FsZXJ0KCdmdWgnKTtcbiAgICB9KTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU3RhdHNDaGFydHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEYXRhYmFzZSwgJHRpbWVvdXQsICR0cmFuc2xhdGUsIFNldHRpbmdzU2VydmljZSwgJGlvbmljTG9hZGluZykge1xuXG4gICRzY29wZS4kb24oXCIkaW9uaWNWaWV3LmJlZm9yZUVudGVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgJGlvbmljTG9hZGluZy5zaG93KHtcbiAgICAgICAgICB0ZW1wbGF0ZTogJ0xvYWRpbmcuLi4nXG4gICAgICB9KTtcbiAgICAgJHNjb3BlLnNob3dEaWFycmhlYSA9IFNldHRpbmdzU2VydmljZS5nZXRTaG93RGlhcnJoZWEoKTtcbiAgICAgLy9pZiAoRGF0YWJhc2UuaGFzQ2hhbmdlZCgnc3RhdHMnKSA9PT0gdHJ1ZSkge1xuICAgICAgRGF0YWJhc2UuYWxsKGZ1bmN0aW9uKGFsbERhdGEpIHtcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJHNjb3BlLmFsbERhdGEgPSBhbGxEYXRhO1xuICAgICAgICAgIERhdGFiYXNlLmdvdERhdGEoJ3N0YXRzJyk7XG4gICAgICAgICAgY2FsdWxhdGVDaGFydERhdGEoYWxsRGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7IFxuICAgIC8vfVxuICB9KTtcblxuICB2YXIgY2FsdWxhdGVDaGFydERhdGEgPSBmdW5jdGlvbihjaGFydERhdGEpIHtcbiAgXHR2YXIgZmluYWxEYXRhID0gW10sIGJsb29kRGF0YSA9IFtdLCBkaWFycmhlYURhdGEgPSBbXTtcblxuICBcdGZvciAodmFyIGkgPSAwLCB5ID0gY2hhcnREYXRhLmxlbmd0aDsgaSA8IHk7IGkrKykge1xuICBcdFx0Y2hhcnREYXRhW2ldLmRhdGUgPSBuZXcgRGF0ZShjaGFydERhdGFbaV0uZGF0ZSk7XG4gIFx0XHR2YXIgdXRjRGF0ZSA9IERhdGUuVVRDKGNoYXJ0RGF0YVtpXS5kYXRlLmdldEZ1bGxZZWFyKCksKGNoYXJ0RGF0YVtpXS5kYXRlLmdldE1vbnRoKCkpLGNoYXJ0RGF0YVtpXS5kYXRlLmdldERhdGUoKSk7XG5cbiAgICAgIGlmIChjaGFydERhdGFbaV0udHlwZSAhPSAncG9vJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cdCAgXHRcdFxuXG4gICAgICBhZGRJbkFycmF5KGZpbmFsRGF0YSx1dGNEYXRlLDEpO1xuICAgICAgYWRkSW5BcnJheShibG9vZERhdGEsdXRjRGF0ZSxjaGFydERhdGFbaV0uYmxvb2QpO1xuXG4gICAgICBpZiggJHNjb3BlLnNob3dEaWFycmhlYSkge1xuICAgICAgICBpZiAodHlwZW9mIGNoYXJ0RGF0YVtpXS5kaWFycmhlYSA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgY2hhcnREYXRhW2ldLmRpYXJyaGVhID0gMDtcbiAgICAgICAgfVxuICAgICAgICBhZGRJbkFycmF5KGRpYXJyaGVhRGF0YSx1dGNEYXRlLGNoYXJ0RGF0YVtpXS5kaWFycmhlYSk7XG4gICAgICB9XG4gICAgICBcbiAgXHR9XG5cbiAgICAkdHJhbnNsYXRlKFtcIlBPT1wiLFwiYWRkX0JMT09EXCIsXCJhZGRfRElBUlJIRUFcIl0pLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0ZuKHRyYW5zbGF0aW9ucykge1xuICAgICAgZHJhd0NoYXJ0KGZpbmFsRGF0YSwgYmxvb2REYXRhLCBkaWFycmhlYURhdGEsIHRyYW5zbGF0aW9ucyk7XG4gICAgICAgICRpb25pY0xvYWRpbmcuaGlkZSgpO1xuICAgIH0pOyAgXHRcbiAgfTtcblxuICB2YXIgYWRkSW5BcnJheSA9IGZ1bmN0aW9uKHBBcnJheSwgdXRjRGF0ZSwgYXVnbWVudFZhbHVlKSB7XG4gICAgdmFyIGlzTmV3ID0gdHJ1ZTtcbiAgICAgIGZvciAodmFyIGogPSAwLCBrID0gcEFycmF5Lmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgICBpZiAocEFycmF5W2pdWzBdID09PSB1dGNEYXRlKSB7XG4gICAgICAgICAgaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaXNOZXcpIHtcbiAgICAgICAgcEFycmF5LnB1c2goW3V0Y0RhdGUsYXVnbWVudFZhbHVlXSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcEFycmF5W2pdWzFdID0gcEFycmF5W2pdWzFdICsgYXVnbWVudFZhbHVlO1xuICAgICAgfSBcbiAgfTtcblxuICB2YXIgZHJhd0NoYXJ0ID0gZnVuY3Rpb24oZmluYWxEYXRhLCBibG9vZERhdGEsIGRpYXJyaGVhRGF0YSwgdHJhbnNsYXRpb25zKSB7XG4gIFx0bmV3IEhpZ2hjaGFydHMuQ2hhcnQoe1xuICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgcmVuZGVyVG8gOiAnY29udGFpbmVyJyxcbiAgICAgICAgICAgIHR5cGU6ICdzcGxpbmUnLFxuICAgICAgICAgICAgem9vbVR5cGU6ICd4J1xuICAgICAgICB9LFxuICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgdGV4dDogJydcbiAgICAgICAgfSxcbiAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdkYXRldGltZScsXG4gICAgICAgICAgICBkYXRlVGltZUxhYmVsRm9ybWF0czogeyAvLyBkb24ndCBkaXNwbGF5IHRoZSBkdW1teSB5ZWFyXG4gICAgICAgICAgICAgICAgbW9udGg6ICclZS4gJWInLFxuICAgICAgICAgICAgICAgIHllYXI6ICclYidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgIHRleHQ6ICcnXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHlBeGlzOiB7XG4gICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgIHRleHQ6ICcnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWxsb3dEZWNpbWFsczogZmFsc2UsXG4gICAgICAgICAgICBtaW46IDBcbiAgICAgICAgfSxcbiAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIHNlcmllczogW3tcbiAgICAgICAgICAgIG5hbWU6IHRyYW5zbGF0aW9ucy5QT08sXG4gICAgICAgICAgICB0eXBlOiAnYXJlYXNwbGluZScsXG4gICAgICAgICAgICAvLyBEZWZpbmUgdGhlIGRhdGEgcG9pbnRzLiBBbGwgc2VyaWVzIGhhdmUgYSBkdW1teSB5ZWFyXG4gICAgICAgICAgICAvLyBvZiAxOTcwLzcxIGluIG9yZGVyIHRvIGJlIGNvbXBhcmVkIG9uIHRoZSBzYW1lIHggYXhpcy4gTm90ZVxuICAgICAgICAgICAgLy8gdGhhdCBpbiBKYXZhU2NyaXB0LCBtb250aHMgc3RhcnQgYXQgMCBmb3IgSmFudWFyeSwgMSBmb3IgRmVicnVhcnkgZXRjLlxuICAgICAgICAgICAgZGF0YTogZmluYWxEYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6IHRyYW5zbGF0aW9ucy5hZGRfQkxPT0QsXG4gICAgICAgICAgICAvLyBEZWZpbmUgdGhlIGRhdGEgcG9pbnRzLiBBbGwgc2VyaWVzIGhhdmUgYSBkdW1teSB5ZWFyXG4gICAgICAgICAgICAvLyBvZiAxOTcwLzcxIGluIG9yZGVyIHRvIGJlIGNvbXBhcmVkIG9uIHRoZSBzYW1lIHggYXhpcy4gTm90ZVxuICAgICAgICAgICAgLy8gdGhhdCBpbiBKYXZhU2NyaXB0LCBtb250aHMgc3RhcnQgYXQgMCBmb3IgSmFudWFyeSwgMSBmb3IgRmVicnVhcnkgZXRjLlxuICAgICAgICAgICAgZGF0YTogYmxvb2REYXRhLFxuICAgICAgICAgICAgY29sb3I6ICcjRUY0NzNBJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogdHJhbnNsYXRpb25zLmFkZF9ESUFSUkhFQSxcbiAgICAgICAgICAvLyBEZWZpbmUgdGhlIGRhdGEgcG9pbnRzLiBBbGwgc2VyaWVzIGhhdmUgYSBkdW1teSB5ZWFyXG4gICAgICAgICAgLy8gb2YgMTk3MC83MSBpbiBvcmRlciB0byBiZSBjb21wYXJlZCBvbiB0aGUgc2FtZSB4IGF4aXMuIE5vdGVcbiAgICAgICAgICAvLyB0aGF0IGluIEphdmFTY3JpcHQsIG1vbnRocyBzdGFydCBhdCAwIGZvciBKYW51YXJ5LCAxIGZvciBGZWJydWFyeSBldGMuXG4gICAgICAgICAgZGF0YTogZGlhcnJoZWFEYXRhLFxuICAgICAgICAgIGNvbG9yOiAnI0ZGQzkwMCdcbiAgICAgICAgfV1cbiAgICB9KTtcbiAgfTtcblxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdUYWJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEYXRhYmFzZSkge1xuXG4gICRzY29wZS4kb24oXCIkaW9uaWNWaWV3LmJlZm9yZUVudGVyXCIsIGZ1bmN0aW9uKCBzY29wZXMsIHN0YXRlcyApIHtcbiAgICBEYXRhYmFzZS5sYXN0RW50cnkoZnVuY3Rpb24obGFzdEVudHJ5KSB7XG4gICAgICAkc2NvcGUubGFzdEVudHJ5ID0gbGFzdEVudHJ5O1xuICAgIH0pO1xuICB9KTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLnNlcnZpY2VzJykuZmFjdG9yeSgnQmFja3VwU2VydmljZScsIGZ1bmN0aW9uKCRxLCAkY29yZG92YUZpbGUsIERhdGFiYXNlKSB7XG4gIHZhciBiYWNrdXBGaWxlcyA9IFtdO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0QmFja3VwRmlsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgaWYgKGNvcmRvdmEgJiYgY29yZG92YS5maWxlICYmIGNvcmRvdmEuZmlsZS5leHRlcm5hbFJvb3REaXJlY3RvcnkgJiYgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwpIHtcbiAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoY29yZG92YS5maWxlLmV4dGVybmFsUm9vdERpcmVjdG9yeSwgZnVuY3Rpb24oZGlyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJHZXQgZmlsZWxpc3RcIik7XG4gICAgICAgICAgdmFyIGRpclJlYWRlciA9IGRpci5jcmVhdGVSZWFkZXIoKTtcblxuICAgICAgICAgIGRpclJlYWRlci5yZWFkRW50cmllcyAoZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgICAgYmFja3VwRmlsZXMgPSBbXTtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShyZXN1bHRzKSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbaV0ubmFtZS5pbmRleE9mKFwiUG9vY291bnRcIikgPj0gMCkge1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzdWx0c1tpXS5uYW1lKTtcbiAgICAgICAgICAgICAgICBiYWNrdXBGaWxlcy5wdXNoKHtuYW1lOiByZXN1bHRzW2ldLm5hbWUsIG5hdGl2ZVVSTDogcmVzdWx0c1tpXS5uYXRpdmVVUkx9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGJhY2t1cEZpbGVzKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG5cbiAgICB9LFxuICAgIGV4cG9ydEJhY2t1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG4gICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChjb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxSb290RGlyZWN0b3J5LCBmdW5jdGlvbihkaXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJFeHBvcnQ6IGdvdG8gc2RjYXJkXCIsZGlyKTtcbiAgICAgICAgZGlyLmdldEZpbGUoXCJQb29jb3VudEJhY2t1cF9cIiArIG1vbWVudChuZXcgRGF0ZSgpKS5mb3JtYXQoXCJZWVlZTU1ERF9oaG1tc3NcIikgKyBcIi50eHRcIiwge2NyZWF0ZTp0cnVlfSwgZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiY3JlYXRlIGZpbGVcIiwgZmlsZSk7XG4gICAgICAgICAgXG4gICAgICAgICAgZmlsZS5jcmVhdGVXcml0ZXIoZnVuY3Rpb24oZmlsZVdyaXRlcikge1xuXG4gICAgICAgICAgICAvLyB1c2UgdG8gYXBwZW5kXG4gICAgICAgICAgICAvL2ZpbGVXcml0ZXIuc2VlayhmaWxlV3JpdGVyLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIERhdGFiYXNlLmFsbChmdW5jdGlvbihhbGxEYXRhKSB7XG5cbiAgICAgICAgICAgICAgdmFyIGV4cG9ydE9iamVjdCA9IHt9O1xuICAgICAgICAgICAgICBleHBvcnRPYmplY3QucG9vY291bnREQlZlcnNpb24gPSAwO1xuICAgICAgICAgICAgICBleHBvcnRPYmplY3QuZGF0YSA9IGFsbERhdGE7XG5cbiAgICAgICAgICAgICAgdmFyIGJsb2IgPSBuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkoZXhwb3J0T2JqZWN0KV0sIHt0eXBlOid0ZXh0L3BsYWluJ30pO1xuICAgICAgICAgICAgICBmaWxlV3JpdGVyLndyaXRlKGJsb2IpO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZpbGUgd3JvdGVcIik7XG4gICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pOyBcblxuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXJyb3IpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG4gICAgaW1wb3J0QmFja3VwOiBmdW5jdGlvbihmaWxlVVJJKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG4gICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChmaWxlVVJJLCBmdW5jdGlvbihmaWxlRW50cnkpIHtcblxuICAgICAgICBmaWxlRW50cnkuZmlsZShmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciBpbXBvcnRlZERhdGEgPSBKU09OLnBhcnNlKHJlYWRlci5yZXN1bHQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJGaWxlZGF0YTogXCIgKyBKU09OLnN0cmluZ2lmeShpbXBvcnRlZERhdGEpKTtcblxuICAgICAgICAgICAgRGF0YWJhc2UuaW1wb3J0RGF0YShpbXBvcnRlZERhdGEuZGF0YSk7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiICsgSlNPTi5zdHJpbmdpZnkoZSkpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSxcbiAgICBkZWxldGVCYWNrdXBGaWxlOiBmdW5jdGlvbihmaWxlVVJJKSB7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG4gICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChmaWxlVVJJLCBmdW5jdGlvbihmaWxlRW50cnkpIHtcblxuICAgICAgICBmaWxlRW50cnkucmVtb3ZlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdGaWxlIHJlbW92ZWQuJyk7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICB9LCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlKSk7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9XG4gIH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5zZXJ2aWNlcycpLmZhY3RvcnkoJ0RhdGFiYXNlJywgZnVuY3Rpb24oKSB7XG4gIC8vIE1pZ2h0IHVzZSBhIHJlc291cmNlIGhlcmUgdGhhdCByZXR1cm5zIGEgSlNPTiBhcnJheVxuXG4gIC8vIFNvbWUgZmFrZSB0ZXN0aW5nIGRhdGFcbiAgdmFyIGFsbERhdGEgPSBbXSxcbiAgb25SZWFkeSA9IG51bGwsXG4gIG9uUmVhZHlMYXN0ID0gbnVsbCxcbiAgbGFzdElkID0gMCxcbiAgaGFzQ2hhbmdlZERhdGEgPSB7fTtcbiAgdGhhdCA9IHRoaXM7XG5cbiAgbG9jYWxmb3JhZ2UuY29uZmlnKHtcbiAgICBkcml2ZXI6IGxvY2FsZm9yYWdlLkxPQ0FMU1RPUkFHRSxcbiAgICBuYW1lOiAncG9vY291bnRTdG9yYWdlJ1xuICB9KTtcblxuICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdhbGxEYXRhJykudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgIC8vIFRoZSBzYW1lIGNvZGUsIGJ1dCB1c2luZyBFUzYgUHJvbWlzZXMuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBhbGxEYXRhID0gdmFsdWU7XG4gICAgICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgICBpZiAob25SZWFkeSkge1xuICAgICAgICBvblJlYWR5KGFsbERhdGEpO1xuICAgICAgfVxuICAgICAgaWYgKG9uUmVhZHlMYXN0KSB7XG4gICAgICAgIG9uUmVhZHlMYXN0KGdldExhc3RFbnRyeSgpKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2xhc3RJZCcpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBUaGUgc2FtZSBjb2RlLCBidXQgdXNpbmcgRVM2IFByb21pc2VzLlxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgbGFzdElkID0gdmFsdWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbGFzdElkID0gMDtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBzYXZlVG9Mb2NhbFN0b3JhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICBhbGxEYXRhID0gIF8uc29ydEJ5KGFsbERhdGEsIGZ1bmN0aW9uKGVsbSl7IHJldHVybiBlbG0uZGF0ZTsgfSk7XG4gICAgbG9jYWxmb3JhZ2Uuc2V0SXRlbSgnYWxsRGF0YScsIGFsbERhdGEpO1xuICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2xhc3RJZCcsIGxhc3RJZCk7XG4gICAgZGF0YUNoYW5nZWQoKTtcbiAgICBpZiAob25SZWFkeUxhc3QpIHtcbiAgICAgIG9uUmVhZHlMYXN0KGdldExhc3RFbnRyeSgpKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGdldE5ld0lkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGFsbERhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICBsYXN0SWQgPSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxhc3RJZCsrO1xuICAgIH1cblxuICAgIHJldHVybiBsYXN0SWQ7XG4gIH07XG5cbiAgdmFyIGdldEluZGV4RnJvbUlkID0gZnVuY3Rpb24oZGF0YUlkKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIHkgPSBhbGxEYXRhLmxlbmd0aDsgaSA8IHk7IGkrKykge1xuICAgICAgaWYgKGFsbERhdGFbaV0uaWQgPT0gZGF0YUlkKSB7XG4gICAgICAgIHJldHVybiBpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKFwiSW5kZXggbm90IGZvdW5kOiBcIiArIGRhdGFJZCk7XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIHZhciBkYXRhQ2hhbmdlZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgZm9yICh2YXIgcGFyYW0gaW4gaGFzQ2hhbmdlZERhdGEpIHtcbiAgICAgIGhhc0NoYW5nZWREYXRhW3BhcmFtXSA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIHZhciBnZXRMYXN0RW50cnkgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gYWxsRGF0YVthbGxEYXRhLmxlbmd0aC0xXTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFsbDogZnVuY3Rpb24oY2IpIHtcbiAgICAgIG9uUmVhZHkgPSBjYjtcbiAgICAgIGlmKG9uUmVhZHkpIHtcbiAgICAgICAgb25SZWFkeShhbGxEYXRhKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGxhc3RFbnRyeTogZnVuY3Rpb24oY2IpIHtcbiAgICAgIG9uUmVhZHlMYXN0ID0gY2I7XG4gICAgICBpZihvblJlYWR5TGFzdCkge1xuICAgICAgICBvblJlYWR5TGFzdChnZXRMYXN0RW50cnkoKSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGRhdGFJZCkge1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhGcm9tSWQoZGF0YUlkKTtcbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIHJldHVybiBhbGxEYXRhW2luZGV4XTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBkZWxldGVFbGVtZW50OiBmdW5jdGlvbihkYXRhSWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRlOiBcIiArIGRhdGFJZCk7XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEZyb21JZChkYXRhSWQpO1xuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgYWxsRGF0YS5zcGxpY2UoaW5kZXgsMSk7XG4gICAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVsZXRlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRGVsZXRlIGFsbFwiKTtcbiAgICAgIGFsbERhdGEgPSBbXTtcbiAgICAgIGRhdGFDaGFuZ2VkKCk7XG4gICAgICBsb2NhbGZvcmFnZS5jbGVhcigpO1xuICAgIH0sXG4gICAgYWRkOiBmdW5jdGlvbihuZXdFbnRyeSkge1xuICAgICAgbmV3RW50cnkuaWQgPSBnZXROZXdJZCgpO1xuICAgICAgYWxsRGF0YS5wdXNoKG5ld0VudHJ5KTtcbiAgICAgIGNvbnNvbGUubG9nKG5ld0VudHJ5LmlkKTtcbiAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgpO1xuICAgIH0sXG4gICAgZWRpdDogZnVuY3Rpb24oZGF0YUlkLCBlZGl0RW50cnkpIHtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4RnJvbUlkKGRhdGFJZCk7XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBhbGxEYXRhW2luZGV4XSA9IGVkaXRFbnRyeTtcbiAgICAgICAgc2F2ZVRvTG9jYWxTdG9yYWdlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBoYXNDaGFuZ2VkOiBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKHR5cGVvZiBoYXNDaGFuZ2VkRGF0YVtjaGlsZF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBoYXNDaGFuZ2VkRGF0YVtjaGlsZF07XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGdvdERhdGE6IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICBoYXNDaGFuZ2VkRGF0YVtjaGlsZF0gPSBmYWxzZTtcbiAgICB9LFxuICAgIGltcG9ydERhdGE6IGZ1bmN0aW9uKGltcG9ydGVkRGF0YSkge1xuICAgICAgYWxsRGF0YSA9IGltcG9ydGVkRGF0YTtcbiAgICAgIGxhc3RJZCA9IF8uc29ydEJ5KGltcG9ydGVkRGF0YSwgZnVuY3Rpb24oZWxtKXsgcmV0dXJuIGVsbS5pZDsgfSlbaW1wb3J0ZWREYXRhLmxlbmd0aC0xXS5pZDtcbiAgICAgIGNvbnNvbGUubG9nKFwibGFzdElkIGFmdGVyIGltcG9ydDogXCIgKyBsYXN0SWQpO1xuICAgICAgc2F2ZVRvTG9jYWxTdG9yYWdlKCk7XG4gICAgfSxcbiAgICBjcmVhdGVEZW1vRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICBhbGxEYXRhID0gW107XG4gICAgICB2YXIgY3VycmVudERhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgdmFyIGVudHJ5c1BlckRheSA9IDQ7XG5cbiAgICAgIGZvcih2YXIgaT0wOyBpPDM2MDsgaSsrKSB7XG4gICAgICAgIHZhciBuZXdFbnRyeXNQZXJEYXkgPSBNYXRoLnJhbmRvbSgpICogKDcgLSAxKSArIDE7XG4gICAgICAgIGlmIChuZXdFbnRyeXNQZXJEYXkgPiBlbnRyeXNQZXJEYXkpIHtcbiAgICAgICAgICBlbnRyeXNQZXJEYXkrKztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChuZXdFbnRyeXNQZXJEYXkgPCBlbnRyeXNQZXJEYXkpIHtcbiAgICAgICAgICBlbnRyeXNQZXJEYXktLTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcih2YXIgaj0wOyBqPGVudHJ5c1BlckRheTsgaisrKSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhuZXcgRGF0ZShjdXJyZW50RGF0ZSkpO1xuICAgICAgICAgIC8vdmFyIG5ld0RhdGUgPSBtb21lbnQoY3VycmVudERhdGUgKyBcIiBcIiArIFwiMDg6MzBcIiwgXCJNTS9ERC9ZWVlZIEhIOm1tXCIpLnRvRGF0ZSgpO1xuICAgICAgICAgIGFsbERhdGEucHVzaCh7IGlkIDogZ2V0TmV3SWQoKSwgZGF0ZSA6IG1vbWVudChuZXcgRGF0ZShjdXJyZW50RGF0ZSkpLnRvRGF0ZSgpLCB0aW1lIDogXCIwODozMFwiLCB0eXBlIDogXCJwb29cIiwgYmxvb2QgOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSwgZGlhcnJoZWEgOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKX0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudERhdGUuc2V0RGF0ZShjdXJyZW50RGF0ZS5nZXREYXRlKCkgLSAxKTtcbiAgICAgIH1cblxuICAgICAgc2F2ZVRvTG9jYWxTdG9yYWdlKCk7XG4gICAgfVxuICB9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuc2VydmljZXMnKS5mYWN0b3J5KCdMaXN0U2VydmljZScsIGZ1bmN0aW9uKERhdGFiYXNlLCAkcSkge1xuICAvLyBNaWdodCB1c2UgYSByZXNvdXJjZSBoZXJlIHRoYXQgcmV0dXJucyBhIEpTT04gYXJyYXlcblxuICAvLyBTb21lIGZha2UgdGVzdGluZyBkYXRhXG4gIHZhciBhbGxEYXRhID0gW10sXG4gICAgZ3JvdXBzID0gW10sXG4gICAgbG9hZGVkID0gZmFsc2U7XG4gICAgdGhhdCA9IHRoaXM7XG5cbiAgdmFyIGNyZWF0ZURhdGVHcm91cHMgPSBmdW5jdGlvbihhbGxEYXRhKSB7XG4gICAgdmFyIHRtcEdyb3VwcyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIHkgPSBhbGxEYXRhLmxlbmd0aDsgaSA8IHk7IGkrKykge1xuICAgICAgYWxsRGF0YVtpXS5kYXRlID0gbmV3IERhdGUoYWxsRGF0YVtpXS5kYXRlKTtcbiAgICAgIGFkZEluQXJyYXkodG1wR3JvdXBzLCBtb21lbnQoYWxsRGF0YVtpXS5kYXRlKS5mb3JtYXQoJ0REL01NL1lZWVknKSwgbW9tZW50KGFsbERhdGFbaV0uZGF0ZSkudG9EYXRlKCksIGFsbERhdGFbaV0pO1xuICAgIH1cblxuICAgIHRoYXQuZ3JvdXBzID0gdG1wR3JvdXBzO1xuICB9O1xuXG4gIHZhciBhZGRJbkFycmF5ID0gZnVuY3Rpb24ocEFycmF5LCBjaGVja0RhdGUsIGRhdGUsIGVsZW1lbnQpIHtcbiAgICB2YXIgaXNOZXcgPSB0cnVlO1xuICAgIGZvciAodmFyIGogPSAwLCBrID0gcEFycmF5Lmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgaWYgKHBBcnJheVtqXS5jaGVja0RhdGUgPT09IGNoZWNrRGF0ZSkge1xuICAgICAgICBpc05ldyA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIHBBcnJheS5wdXNoKHtcbiAgICAgICAgY2hlY2tEYXRlOiBjaGVja0RhdGUsXG4gICAgICAgIGRhdGU6IGRhdGUsXG4gICAgICAgIHBvbzogZWxlbWVudC50eXBlID09ICdwb28nID8gMSA6IDAsXG4gICAgICAgIG5vdGVzOiBlbGVtZW50LnR5cGUgPT0gJ25vdGUnID8gMSA6IDAsXG4gICAgICAgIGJsb29kOiBlbGVtZW50LmJsb29kLFxuICAgICAgICBpdGVtczogW2VsZW1lbnRdXG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBwQXJyYXlbal0uYmxvb2QgKz0gZWxlbWVudC5ibG9vZDtcbiAgICAgIGlmIChlbGVtZW50LnR5cGUgPT0gJ3BvbycpIHtcbiAgICAgICAgcEFycmF5W2pdLnBvbyArPSAxO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoZWxlbWVudC50eXBlID09ICdub3RlJykge1xuICAgICAgICBwQXJyYXlbal0ubm90ZXMgKz0gMTtcbiAgICAgIH1cbiAgICAgIHBBcnJheVtqXS5pdGVtcy5wdXNoKGVsZW1lbnQpO1xuICAgIH1cbiAgfTtcblxuXG4gIHZhciBpbml0TGlzdFNlcnZpY2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG4gICAgaWYgKCFsb2FkZWQgfHwgRGF0YWJhc2UuaGFzQ2hhbmdlZCgnbGlzdFNlcnZpY2UnKSkge1xuICAgICAgRGF0YWJhc2UuYWxsKGZ1bmN0aW9uKGFsbERhdGEpIHtcbiAgICAgICAgYWxsRGF0YSA9IGFsbERhdGEuc2xpY2UoKS5yZXZlcnNlKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2FsbGJhY2sgb25EYXRhUmVhZHkgZm9yIGxpc3Qgc2VydmljZVwiLCBhbGxEYXRhKTtcblxuICAgICAgICBpZihhbGxEYXRhLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjcmVhdGVEYXRlR3JvdXBzKGFsbERhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgRGF0YWJhc2UuZ290RGF0YSgnbGlzdFNlcnZpY2UnKTtcblxuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgfVxuXG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGluaXRMaXN0U2VydmljZTogaW5pdExpc3RTZXJ2aWNlLFxuICAgIGdldERheXNMaXN0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGF0Lmdyb3VwcztcbiAgICB9LFxuICAgIGdldERheUxpc3Q6IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICByZXR1cm4gdGhhdC5ncm91cHNbaW5kZXhdO1xuICAgIH1cbiAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLnNlcnZpY2VzJykuZmFjdG9yeSgnU2V0dGluZ3NTZXJ2aWNlJywgZnVuY3Rpb24oJHEpIHtcbiAgdmFyIGxhbmd1YWdlID0gXCJcIixcbiAgbGFuZ3VhZ2VJc1NldCA9IGZhbHNlLFxuICBzaG93RGlhcnJoZWEgPSBmYWxzZTtcblxuICBsb2NhbGZvcmFnZS5jb25maWcoe1xuICAgIGRyaXZlcjogbG9jYWxmb3JhZ2UuTE9DQUxTVE9SQUdFLFxuICAgIG5hbWU6ICdwb29jb3VudFN0b3JhZ2UnXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0TGFuZ3VhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGxhbmd1YWdlO1xuICAgIH0sXG4gICAgc2V0TGFuZ3VhZ2U6IGZ1bmN0aW9uKG5ld0xhbmd1YWdlKSB7XG4gICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdsYW5ndWFnZScsIG5ld0xhbmd1YWdlKTtcbiAgICAgIGxhbmd1YWdlID0gbmV3TGFuZ3VhZ2U7XG4gICAgfSxcbiAgICBpbml0U2V0dGluZ3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGNvdWxkIEkgbW92ZSB0aGlzIGp1c3Qgb24gdG9wIGxpa2Ugd2l0aCBzaG93RGlhcnJoZWE/PyB0byB0ZXN0XG5cbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2xhbmd1YWdlJykudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICBsYW5ndWFnZSA9IHZhbHVlO1xuICAgICAgICAgIGxhbmd1YWdlSXNTZXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuICAgIGdldFNob3dEaWFycmhlYTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ3Nob3dEaWFycmhlYScpO1xuICAgIH0sXG4gICAgc2V0U2hvd0RpYXJyaGVhOiBmdW5jdGlvbihuZXdTaG93RGlhcnJoZWEpIHtcbiAgICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ3Nob3dEaWFycmhlYScsIG5ld1Nob3dEaWFycmhlYSk7XG4gICAgICBzaG93RGlhcnJoZWEgPSBuZXdTaG93RGlhcnJoZWE7XG4gICAgfVxuICB9O1xufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9