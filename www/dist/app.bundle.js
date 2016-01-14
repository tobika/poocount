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

        $scope.showDiarrhea = SettingsService.getShowDiarrhea();
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
  $scope.showDiarrhea = SettingsService.getShowDiarrhea();

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

  localforage.getItem('showDiarrhea').then(function(value) {
    if (value) {
      showDiarrhea = value;
    }
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
      return showDiarrhea;
    },
    setShowDiarrhea: function(newShowDiarrhea) {
      localforage.setItem('showDiarrhea', newShowDiarrhea);
      showDiarrhea = newShowDiarrhea;
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbmZpZ19yb3V0ZXMuanMiLCJjb25maWdfdHJhbnNsYXRpb24uanMiLCJjb250cm9sbGVyX2FkZC5qcyIsImNvbnRyb2xsZXJfbGlzdC5qcyIsImNvbnRyb2xsZXJfc2V0dGluZ3MuanMiLCJjb250cm9sbGVyX3NldHRpbmdzX2JhY2t1cC5qcyIsImNvbnRyb2xsZXJfc2V0dGluZ3NfZGV2ZWxvcGVyLmpzIiwiY29udHJvbGxlcl9zZXR0aW5nc19sYW5ndWFnZXMuanMiLCJjb250cm9sbGVyX3N0YXRzLmpzIiwiY29udHJvbGxlcl9zdGF0c19jaGFydHMuanMiLCJjb250cm9sbGVyX3RhYi5qcyIsInNlcnZpY2VfYmFja3VwLmpzIiwic2VydmljZV9kYXRhYmFzZS5qcyIsInNlcnZpY2VfbGlzdC5qcyIsInNlcnZpY2Vfc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJb25pYyBTdGFydGVyIEFwcFxuXG4vLyBhbmd1bGFyLm1vZHVsZSBpcyBhIGdsb2JhbCBwbGFjZSBmb3IgY3JlYXRpbmcsIHJlZ2lzdGVyaW5nIGFuZCByZXRyaWV2aW5nIEFuZ3VsYXIgbW9kdWxlc1xuLy8gJ3N0YXJ0ZXInIGlzIHRoZSBuYW1lIG9mIHRoaXMgYW5ndWxhciBtb2R1bGUgZXhhbXBsZSAoYWxzbyBzZXQgaW4gYSA8Ym9keT4gYXR0cmlidXRlIGluIGluZGV4Lmh0bWwpXG4vLyB0aGUgMm5kIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiAncmVxdWlyZXMnXG4vLyAnc3RhcnRlci5zZXJ2aWNlcycgaXMgZm91bmQgaW4gc2VydmljZV9kYXRhYmFzZS5qc1xuLy8gJ3N0YXJ0ZXIuY29udHJvbGxlcnMnIGlzIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG5hbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicsIFsnaW9uaWMnLCAndGVtcGxhdGVzJywgJ25nQ29yZG92YScsICdzdGFydGVyLmNvbnRyb2xsZXJzJywgJ3N0YXJ0ZXIuc2VydmljZXMnLCAnYW5ndWxhci1kYXRlcGlja2VyJywgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSlcblxuLnJ1bihmdW5jdGlvbigkaW9uaWNQbGF0Zm9ybSwgJHRyYW5zbGF0ZSwgU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgLy9jb25zb2xlLmxvZyhpb25pYy5QbGF0Zm9ybS5pc1dlYlZpZXcoKSk7XG4gICAgY29uc29sZS5sb2coXCJDb3Jkb3ZhIHJlYWR5XCIpO1xuXG4gICAgaWYgKCBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnNwbGFzaHNjcmVlbikge1xuICAgICAgbmF2aWdhdG9yLnNwbGFzaHNjcmVlbi5oaWRlKCk7XG4gICAgICBjb25zb2xlLmxvZyhcIkhpZGUgc3BsYXNoc2NyZWVuXCIpO1xuICAgIH1cblxuXG4gICAgU2V0dGluZ3NTZXJ2aWNlLmluaXRTZXR0aW5ncygpLnRoZW4oIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2coXCJsYW5ndWFnZSBpbml0aWFsaXplZFwiKTtcblxuICAgICAgdmFyIGxhbmcgPSBTZXR0aW5nc1NlcnZpY2UuZ2V0TGFuZ3VhZ2UoKTtcbiAgICAgIGNvbnNvbGUubG9nKFwibGFuZ3VhZ2U6IFwiICsgbGFuZyk7XG4gICAgICBpZiAobGFuZy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiU2V0IHByZXNldCBsYW5ndWFnZVwiKTtcbiAgICAgICAgJHRyYW5zbGF0ZS51c2UobGFuZyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgbmF2aWdhdG9yLmdsb2JhbGl6YXRpb24gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVXNlIGdsb2JhbGl6YXRpb24gcGx1Z2luXCIpO1xuICAgICAgbmF2aWdhdG9yLmdsb2JhbGl6YXRpb24uZ2V0TG9jYWxlTmFtZShcbiAgICAgICAgZnVuY3Rpb24gKGxvY2FsZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2NhbGU6ICcgKyBsb2NhbGUudmFsdWUgKyAnXFxuJyk7XG4gICAgICAgICAgbGFuZyA9IGxvY2FsZS52YWx1ZS5zcGxpdChcIi1cIilbMF07XG4gICAgICAgICAgJHRyYW5zbGF0ZS51c2UobGFuZykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBTZXR0aW5nc1NlcnZpY2Uuc2V0TGFuZ3VhZ2UobGFuZyk7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU1VDQ0VTUyAtPiBcIiArIGRhdGEpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IgLT4gXCIgKyBlcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgZ2V0dGluZyBsb2NhbGVcXG4nKTtcbiAgICAgICAgfVxuICAgICAgKTtcblxuICAgICAgY29uc29sZS5sb2coXCJFbmQgdXNlIG9mIGdsb2JhbGl6YXRpb24gcGx1Z2luXCIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiTm8gZ2xvYmFsaXphdGlvbiBwbHVnaW5cIik7XG4gICAgfVxuXG4gICAgfSk7XG5cbiAgICBpZih3aW5kb3cuY29yZG92YSAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgIH1cblxuICAgIGlmKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgIC8vIG9yZy5hcGFjaGUuY29yZG92YS5zdGF0dXNiYXIgcmVxdWlyZWRcbiAgICAgIFN0YXR1c0Jhci5zdHlsZURlZmF1bHQoKTtcbiAgICB9XG4gIH0pO1xufSlcblxuLmNvbmZpZyhbJyRjb21waWxlUHJvdmlkZXInLCBmdW5jdGlvbiAoJGNvbXBpbGVQcm92aWRlcikge1xuICAvLyBvbmx5IHVzZSB0aGlzIGluIHByb2R1Y3Rpb24gYnVpbGRcbiAgJGNvbXBpbGVQcm92aWRlci5kZWJ1Z0luZm9FbmFibGVkKGZhbHNlKTtcbn1dKTtcblxuYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuc2VydmljZXMnLCBbJ25nQ29yZG92YSddKTtcblxuYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnLCBbJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnXSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlcicpLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkaW9uaWNDb25maWdQcm92aWRlcikge1xuXG4gICAgJGlvbmljQ29uZmlnUHJvdmlkZXIudGFicy5wb3NpdGlvbihcInRvcFwiKTtcbiAgICAvL2lvbmljQ29uZmlnUHJvdmlkZXIudmlld3MubWF4Q2FjaGUoMCk7XG5cbiAgICAvLyBJb25pYyB1c2VzIEFuZ3VsYXJVSSBSb3V0ZXIgd2hpY2ggdXNlcyB0aGUgY29uY2VwdCBvZiBzdGF0ZXNcbiAgICAvLyBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyLXVpL3VpLXJvdXRlclxuICAgIC8vIFNldCB1cCB0aGUgdmFyaW91cyBzdGF0ZXMgd2hpY2ggdGhlIGFwcCBjYW4gYmUgaW4uXG4gICAgLy8gRWFjaCBzdGF0ZSdzIGNvbnRyb2xsZXIgY2FuIGJlIGZvdW5kIGluIGNvbnRyb2xsZXJzLmpzXG4gICAgJHN0YXRlUHJvdmlkZXJcblxuICAgIC8vIHNldHVwIGFuIGFic3RyYWN0IHN0YXRlIGZvciB0aGUgdGFicyBkaXJlY3RpdmVcbiAgICAgICAgLnN0YXRlKCd0YWInLCB7XG4gICAgICAgICAgICB1cmw6IFwiL3RhYlwiLFxuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ0YWJzLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUYWJDdHJsJ1xuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEVhY2ggdGFiIGhhcyBpdHMgb3duIG5hdiBoaXN0b3J5IHN0YWNrOlxuXG4gICAgICAgIC5zdGF0ZSgndGFiLmFkZCcsIHtcbiAgICAgICAgICAgIHVybDogJy9hZGQnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLWFkZCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0YWItbmV3Lmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRkQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCd0YWIuc3RhdHMnLCB7XG4gICAgICAgICAgICB1cmw6ICcvc3RhdHMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLXN0YXRzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RhYi1zdGF0cy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1N0YXRzQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgndGFiLnN0YXRzLWNoYXJ0cycsIHtcbiAgICAgICAgICAgIHVybDogJy9zdGF0cy9jaGFydHMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLXN0YXRzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRzLWNoYXJ0cy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1N0YXRzQ2hhcnRzQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgndGFiLmxpc3QnLCB7XG4gICAgICAgICAgICB1cmw6ICcvbGlzdCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICd0YWItbGlzdCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0YWItbGlzdC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xpc3RDdHJsJyxcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZnVuY3Rpb24gKExpc3RTZXJ2aWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIExpc3RTZXJ2aWNlLmluaXRMaXN0U2VydmljZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3RhYi5saXN0LWRheScsIHtcbiAgICAgICAgICAgIHVybDogJy9saXN0ZGF5LzpkYXlJZCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICd0YWItbGlzdCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsaXN0LWRheS5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xpc3REZXRhaWxEYXlDdHJsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCd0YWIubGlzdC1kZXRhaWwnLCB7XG4gICAgICAgICAgICB1cmw6ICcvbGlzdC86ZnJpZW5kSWQnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLWxpc3QnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGlzdC1kZXRhaWwuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdGcmllbmREZXRhaWxDdHJsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCd0YWIuc2V0dGluZ3MnLCB7XG4gICAgICAgICAgICB1cmw6ICcvc2V0dGluZ3MnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RhYi1zZXR0aW5ncy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NldHRpbmdzQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgndGFiLnNldHRpbmdzLWxhbmd1YWdlcycsIHtcbiAgICAgICAgICAgIHVybDogJy9zZXR0aW5ncy9sYW5ndWFnZXMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NldHRpbmdzLWxhbmd1YWdlcy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NldHRpbmdzTGFuZ3VhZ2VzQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgndGFiLnNldHRpbmdzLWJhY2t1cCcsIHtcbiAgICAgICAgICAgIHVybDogJy9zZXR0aW5ncy9iYWNrdXAnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NldHRpbmdzLWJhY2t1cC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NldHRpbmdzQmFja3VwQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgndGFiLnNldHRpbmdzLWRldmVsb3BlcicsIHtcbiAgICAgICAgICAgIHVybDogJy9zZXR0aW5ncy9kZXZlbG9wZXInLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAndGFiLXNldHRpbmdzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NldHRpbmdzLWRldmVsb3Blci5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1NldHRpbmdzRGV2ZWxvcGVyQ3RybCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgndGFiLnNldHRpbmdzLWhlbHAnLCB7XG4gICAgICAgICAgICB1cmw6ICcvc2V0dGluZ3MvaGVscCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICd0YWItc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc2V0dGluZ3MtaGVscC5odG1sJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cblxuICAgIC8vIGlmIG5vbmUgb2YgdGhlIGFib3ZlIHN0YXRlcyBhcmUgbWF0Y2hlZCwgdXNlIHRoaXMgYXMgdGhlIGZhbGxiYWNrXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL3RhYi9hZGQnKTtcblxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXInKS5jb25maWcoZnVuY3Rpb24gKCR0cmFuc2xhdGVQcm92aWRlcikge1xuXG4gICR0cmFuc2xhdGVQcm92aWRlci51c2VTdGF0aWNGaWxlc0xvYWRlcih7XG4gICAgcHJlZml4OiAnbG9jYWxlcy9sb2NhbGUtJyxcbiAgICBzdWZmaXg6ICcuanNvbidcbiAgfSk7XG5cbiAgJHRyYW5zbGF0ZVByb3ZpZGVyLmZhbGxiYWNrTGFuZ3VhZ2UoJ2VuJyk7XG5cbiAgJHRyYW5zbGF0ZVByb3ZpZGVyLnJlZ2lzdGVyQXZhaWxhYmxlTGFuZ3VhZ2VLZXlzKFsnZW4nLCAnZnInLCAnZGUnXSwge1xuICAgICdlbl9VUyc6ICdlbicsXG4gICAgJ2VuX1VLJzogJ2VuJyxcbiAgICAnZnJfRlInOiAnZnInLFxuICAgICdkZV9ERSc6ICdkZScsXG4gICAgJ2RlX0NIJzogJ2RlJ1xuICB9KTtcblxuICAkdHJhbnNsYXRlUHJvdmlkZXIuZGV0ZXJtaW5lUHJlZmVycmVkTGFuZ3VhZ2UoKTtcblxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgRGF0YWJhc2UsIFNldHRpbmdzU2VydmljZSkge1xuXG4gICAgJHNjb3BlLmVsZW1lbnQgPSB7ZGF0ZTogbW9tZW50KCkuZm9ybWF0KCdERC9NTS9ZWVlZJyksIHRpbWU6IG1vbWVudCgpLmZvcm1hdCgnSEg6bW0nKX07XG5cbiAgICAkc2NvcGUuJG9uKFwiJGlvbmljVmlldy5iZWZvcmVFbnRlclwiLCBmdW5jdGlvbiAoc2NvcGVzLCBzdGF0ZXMpIHtcblxuICAgICAgICAkc2NvcGUuc2hvd0RpYXJyaGVhID0gU2V0dGluZ3NTZXJ2aWNlLmdldFNob3dEaWFycmhlYSgpO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmFkZCA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgZWxlbWVudCA9ICRzY29wZS5lbGVtZW50O1xuXG4gICAgICAgIC8vIGNoZWNrIGlmIHRoZXJlIGlzIG5vIHRpbWV6b25lIHByb2JsZW0gYW55bW9yZSwgYmVmb3JlIGl0IHdhcyBtb21lbnQudXRjXG4gICAgICAgIGVsZW1lbnQuZGF0ZSA9IG1vbWVudChlbGVtZW50LmRhdGUgKyBcIiBcIiArIGVsZW1lbnQudGltZSwgXCJERC9NTS9ZWVlZIEhIOm1tXCIpLnRvRGF0ZSgpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICBEYXRhYmFzZS5hZGQoZWxlbWVudCk7XG4gICAgICAgICRzY29wZS5lbGVtZW50ID0ge1xuICAgICAgICAgICAgZGF0ZTogbW9tZW50KCRzY29wZS5lbGVtZW50LmRhdGUpLmZvcm1hdCgnREQvTU0vWVlZWScpLFxuICAgICAgICAgICAgdGltZTogJHNjb3BlLmVsZW1lbnQudGltZSxcbiAgICAgICAgICAgIHR5cGU6ICRzY29wZS5lbGVtZW50LnR5cGUsXG4gICAgICAgICAgICBibG9vZDogJHNjb3BlLmVsZW1lbnQuYmxvb2RcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoJHNjb3BlLnNob3dEaWFycmhlYSkge1xuXG4gICAgICAgICAgICAkc2NvcGUuZWxlbWVudC5kaWFycmhlYSA9IGVsZW1lbnQuZGlhcnJoZWE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2luZG93LnBsdWdpbnMpIHtcblxuICAgICAgICAgICAgd2luZG93LnBsdWdpbnMudG9hc3Quc2hvdygnTmV3IGVudHJ5IGFkZGVkOiAnICsgZWxlbWVudC5kYXRlLnRvU3RyaW5nKCksICdsb25nJywgJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RvYXN0IHN1Y2Nlc3M6ICcgKyBhKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KCd0b2FzdCBlcnJvcjogJyArIGIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5kZXNrdG9wID0gIWlvbmljLlBsYXRmb3JtLmlzV2ViVmlldygpOy8vISRpb25pY1BsYXRmb3JtLmlzV2ViVmlldygpO1xuXG4gICAgJHNjb3BlLm9wdGlvbnMgPSB7XG4gICAgICAgIGZvcm1hdDogJ2RkL21tL3l5eXknLCAvLyBJU08gZm9ybWF0dGVkIGRhdGVcbiAgICAgICAgLy9jbGVhcjogbnVsbCxcbiAgICAgICAgLy9jb250YWluZXI6ICdib2R5JyxcbiAgICAgICAgb25DbG9zZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIC8vIGRvIHNvbWV0aGluZyB3aGVuIHRoZSBwaWNrZXIgY2xvc2VzXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLm9wdGlvbnNUaW1lID0ge1xuICAgICAgICBmb3JtYXQ6ICdISDppJywgLy8gSVNPIGZvcm1hdHRlZCBkYXRlXG4gICAgICAgIG9uQ2xvc2U6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgd2hlbiB0aGUgcGlja2VyIGNsb3Nlc1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS50b2RheSA9IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAkc2NvcGUuZWxlbWVudC5kYXRlID0gbW9tZW50KCkuZm9ybWF0KCdERC9NTS9ZWVlZJyk7XG4gICAgfTtcbiAgICAkc2NvcGUubm93ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICRzY29wZS5lbGVtZW50LnRpbWUgPSBtb21lbnQoKS5mb3JtYXQoJ0hIOm1tJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5zZXRUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcblxuICAgICAgICAkc2NvcGUuZWxlbWVudC50eXBlID0gdHlwZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNldEJsb29kID0gZnVuY3Rpb24gKGJsb29kKSB7XG5cbiAgICAgICAgJHNjb3BlLmVsZW1lbnQuYmxvb2QgPSBibG9vZDtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNldERpYXJyaGVhID0gZnVuY3Rpb24gKGRpYXJyaGVhKSB7XG5cbiAgICAgICAgJHNjb3BlLmVsZW1lbnQuZGlhcnJoZWEgPSBkaWFycmhlYTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmlzU2VsZWN0ZWQgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICAvLyBUT0RPIHNpbXBsaWZ5XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaXNTZWxlY3RlZFwiKTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJHNjb3BlLmVsZW1lbnQudHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY29udmVydFRvRGF0ZSA9IGZ1bmN0aW9uIChzdHJpbmdEYXRlKSB7XG5cbiAgICAgICAgcmV0dXJuIFwibW9tZW50KHN0cmluZ0RhdGUpLmZvcm1hdCgnREQvTU0vWVlZWScpXCI7XG4gICAgfTtcblxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdMaXN0Q3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGF0YWJhc2UsICR0aW1lb3V0LCBMaXN0U2VydmljZSkge1xuICAkc2NvcGUubGlzdERhdGEgPSBbXTtcbiAgJHNjb3BlLmFsbERhdGEgPSBbXTtcblxuICAkc2NvcGUuJG9uKFwiJGlvbmljVmlldy5iZWZvcmVFbnRlclwiLCBmdW5jdGlvbiggc2NvcGVzLCBzdGF0ZXMgKSB7XG5cbiAgICBpZiAoRGF0YWJhc2UuaGFzQ2hhbmdlZCgnbGlzdENvbnRyb2xsZXInKSA9PT0gdHJ1ZSkge1xuXG4gICAgICAkc2NvcGUuZ3JvdXBzID0gTGlzdFNlcnZpY2UuZ2V0RGF5c0xpc3QoKTtcbiAgICAgIERhdGFiYXNlLmdvdERhdGEoJ2xpc3RDb250cm9sbGVyJyk7XG4gICAgfVxuICB9KTtcblxufSlcblxuLmNvbnRyb2xsZXIoJ0xpc3REZXRhaWxEYXlDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIExpc3RTZXJ2aWNlKSB7XG5cbiAgJHNjb3BlLiRvbihcIiRpb25pY1ZpZXcuYmVmb3JlRW50ZXJcIiwgZnVuY3Rpb24oIHNjb3Blcywgc3RhdGVzICkge1xuICAgIExpc3RTZXJ2aWNlLmluaXRMaXN0U2VydmljZSgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUubGlzdERhdGEgPSBMaXN0U2VydmljZS5nZXREYXlMaXN0KCRzdGF0ZVBhcmFtcy5kYXlJZCk7XG4gICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSgkc2NvcGUubGlzdERhdGEpKTtcbiAgICB9KTtcbiAgfSk7XG59KVxuXG4uY29udHJvbGxlcignRnJpZW5kRGV0YWlsQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBEYXRhYmFzZSwgJGlvbmljSGlzdG9yeSkge1xuXG4gICRzY29wZS4kb24oXCIkaW9uaWNWaWV3LmJlZm9yZUVudGVyXCIsIGZ1bmN0aW9uKCBzY29wZXMsIHN0YXRlcyApIHtcbiAgICAkc2NvcGUuZWxlbWVudCA9IERhdGFiYXNlLmdldCgkc3RhdGVQYXJhbXMuZnJpZW5kSWQpO1xuICB9KTtcblxuICAkc2NvcGUuZGVsZXRlRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xuXG4gIFx0RGF0YWJhc2UuZGVsZXRlRWxlbWVudCgkc2NvcGUuZWxlbWVudC5pZCk7XG4gICAgJGlvbmljSGlzdG9yeS5nb0JhY2soKTtcbiAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2V0dGluZ3NDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBTZXR0aW5nc1NlcnZpY2UpIHtcbiAgJHNjb3BlLnNob3dEaWFycmhlYSA9IFNldHRpbmdzU2VydmljZS5nZXRTaG93RGlhcnJoZWEoKTtcblxuICAkc2NvcGUuc2hvd0RpYXJyaGVhQ2hhbmdlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgU2V0dGluZ3NTZXJ2aWNlLnNldFNob3dEaWFycmhlYSh2YWx1ZSk7XG4gIH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1NldHRpbmdzQmFja3VwQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgQmFja3VwU2VydmljZSwgJGlvbmljQWN0aW9uU2hlZXQpIHtcblxuICAkc2NvcGUuZXhwb3J0QmFja3VwID0gZnVuY3Rpb24oKSB7XG4gICAgQmFja3VwU2VydmljZS5leHBvcnRCYWNrdXAoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLmdldEJhY2t1cEZpbGVzKCk7XG4gICAgfSk7XG5cbiAgfTtcblxuICAkc2NvcGUuZ2V0QmFja3VwRmlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICBCYWNrdXBTZXJ2aWNlLmdldEJhY2t1cEZpbGVzKCkudGhlbiggZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0cykpO1xuICAgICAgJHNjb3BlLmJhY2t1cEZpbGVzID0gcmVzdWx0cztcbiAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQmFja3VwZmlsZXM6IEVycm9yIGFjY2Vzc2luZyBmaWxlc3lzdGVtLlwiKTtcbiAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuc2hvd0FjdGlvblNoZWV0SW1wb3J0ID0gZnVuY3Rpb24oYmFja3VwRmlsZUlkKSB7XG4gICAvLyBTaG93IHRoZSBhY3Rpb24gc2hlZXRcbiAgIHZhciBoaWRlU2hlZXQgPSAkaW9uaWNBY3Rpb25TaGVldC5zaG93KHtcbiAgICAgYnV0dG9uczogW1xuICAgICAgIHsgdGV4dDogJ0ltcG9ydCBCYWNrdXAnIH1cbiAgICAgXSxcbiAgICAgZGVzdHJ1Y3RpdmVUZXh0OiAnRGVsZXRlJyxcbiAgICAgdGl0bGVUZXh0OiAkc2NvcGUuYmFja3VwRmlsZXNbYmFja3VwRmlsZUlkXS5uYW1lLFxuICAgICBjYW5jZWxUZXh0OiAnQ2FuY2VsJyxcbiAgICAgYnV0dG9uQ2xpY2tlZDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICBCYWNrdXBTZXJ2aWNlLmltcG9ydEJhY2t1cCgkc2NvcGUuYmFja3VwRmlsZXNbYmFja3VwRmlsZUlkXS5uYXRpdmVVUkwpO1xuICAgICAgIHJldHVybiB0cnVlO1xuICAgICB9LFxuICAgICBkZXN0cnVjdGl2ZUJ1dHRvbkNsaWNrZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgIEJhY2t1cFNlcnZpY2UuZGVsZXRlQmFja3VwRmlsZSgkc2NvcGUuYmFja3VwRmlsZXNbYmFja3VwRmlsZUlkXS5uYXRpdmVVUkwpO1xuICAgICAgICRzY29wZS5nZXRCYWNrdXBGaWxlcygpO1xuICAgICAgIHJldHVybiB0cnVlO1xuICAgICB9XG4gICB9KTtcbiAgfTtcblxuICAkc2NvcGUuJG9uKFwiJGlvbmljVmlldy5lbnRlclwiLCBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuZ2V0QmFja3VwRmlsZXMoKTtcbiAgfSk7XG5cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2V0dGluZ3NEZXZlbG9wZXJDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEYXRhYmFzZSwgJHRyYW5zbGF0ZSkge1xuICAkc2NvcGUuZGVsZXRlQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgJHRyYW5zbGF0ZSgnc2V0dGluZ3NfQ09ORklSTURFTEVURScpLnRoZW4oZnVuY3Rpb24gc3VjY2Vzc0ZuKHRyYW5zbGF0aW9uKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjb25maXJtKHRyYW5zbGF0aW9uKTtcblxuICAgICAgICBpZiAocmVzdWx0ICkge1xuICAgICAgICAgICAgRGF0YWJhc2UuZGVsZXRlQWxsKCk7XG4gICAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiBlcnJvckZuKHRyYW5zbGF0aW9uSWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdUcmFuc2xhdGlvbiBmYWlsZWQ6JywgdHJhbnNsYXRpb25JZCk7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmNyZWF0ZURlbW9EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3VsdCA9IGNvbmZpcm0oXCJBdHRlbnRpb246IENyZWF0aW5nIGRlbW8gZGF0YSB3aWxsIGRlbGV0ZSBhbGwgeW91ciBvd24gZGF0YS5cIik7XG5cbiAgICBpZiAocmVzdWx0ICkge1xuICAgICAgRGF0YWJhc2UuY3JlYXRlRGVtb0RhdGEoKTtcbiAgICB9XG4gIH07XG5cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2V0dGluZ3NMYW5ndWFnZXNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBEYXRhYmFzZSwgJHRyYW5zbGF0ZSwgU2V0dGluZ3NTZXJ2aWNlKSB7XG4gICRzY29wZS5zZXRMYW5ndWFnZSA9IGZ1bmN0aW9uKGxhbmcpIHtcbiAgICBjb25zb2xlLmxvZyhcIlNldCBsYW5ndWFnZTogXCIgKyBsYW5nKTtcbiAgICAkdHJhbnNsYXRlLnVzZShsYW5nKTtcbiAgICBTZXR0aW5nc1NlcnZpY2Uuc2V0TGFuZ3VhZ2UobGFuZyk7XG4gIH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N0YXRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGF0YWJhc2UsICR0aW1lb3V0LCAkdHJhbnNsYXRlLCBTZXR0aW5nc1NlcnZpY2UpIHtcblxuICAgICRzY29wZS4kb24oXCIkaW9uaWNWaWV3LmJlZm9yZUVudGVyXCIsIGZ1bmN0aW9uKCBzY29wZXMsIHN0YXRlcyApIHtcbiAgICAgICAgLy9hbGVydCgnZnVoJyk7XG4gICAgfSk7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ1N0YXRzQ2hhcnRzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGF0YWJhc2UsICR0aW1lb3V0LCAkdHJhbnNsYXRlLCBTZXR0aW5nc1NlcnZpY2UsICRpb25pY0xvYWRpbmcpIHtcblxuICAkc2NvcGUuJG9uKFwiJGlvbmljVmlldy5iZWZvcmVFbnRlclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICRpb25pY0xvYWRpbmcuc2hvdyh7XG4gICAgICAgICAgdGVtcGxhdGU6ICdMb2FkaW5nLi4uJ1xuICAgICAgfSk7XG4gICAgICRzY29wZS5zaG93RGlhcnJoZWEgPSBTZXR0aW5nc1NlcnZpY2UuZ2V0U2hvd0RpYXJyaGVhKCk7XG4gICAgIC8vaWYgKERhdGFiYXNlLmhhc0NoYW5nZWQoJ3N0YXRzJykgPT09IHRydWUpIHtcbiAgICAgIERhdGFiYXNlLmFsbChmdW5jdGlvbihhbGxEYXRhKSB7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRzY29wZS5hbGxEYXRhID0gYWxsRGF0YTtcbiAgICAgICAgICBEYXRhYmFzZS5nb3REYXRhKCdzdGF0cycpO1xuICAgICAgICAgIGNhbHVsYXRlQ2hhcnREYXRhKGFsbERhdGEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pOyBcbiAgICAvL31cbiAgfSk7XG5cbiAgdmFyIGNhbHVsYXRlQ2hhcnREYXRhID0gZnVuY3Rpb24oY2hhcnREYXRhKSB7XG4gIFx0dmFyIGZpbmFsRGF0YSA9IFtdLCBibG9vZERhdGEgPSBbXSwgZGlhcnJoZWFEYXRhID0gW107XG5cbiAgXHRmb3IgKHZhciBpID0gMCwgeSA9IGNoYXJ0RGF0YS5sZW5ndGg7IGkgPCB5OyBpKyspIHtcbiAgXHRcdGNoYXJ0RGF0YVtpXS5kYXRlID0gbmV3IERhdGUoY2hhcnREYXRhW2ldLmRhdGUpO1xuICBcdFx0dmFyIHV0Y0RhdGUgPSBEYXRlLlVUQyhjaGFydERhdGFbaV0uZGF0ZS5nZXRGdWxsWWVhcigpLChjaGFydERhdGFbaV0uZGF0ZS5nZXRNb250aCgpKSxjaGFydERhdGFbaV0uZGF0ZS5nZXREYXRlKCkpO1xuXG4gICAgICBpZiAoY2hhcnREYXRhW2ldLnR5cGUgIT0gJ3BvbycpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XHQgIFx0XHRcblxuICAgICAgYWRkSW5BcnJheShmaW5hbERhdGEsdXRjRGF0ZSwxKTtcbiAgICAgIGFkZEluQXJyYXkoYmxvb2REYXRhLHV0Y0RhdGUsY2hhcnREYXRhW2ldLmJsb29kKTtcblxuICAgICAgaWYoICRzY29wZS5zaG93RGlhcnJoZWEpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjaGFydERhdGFbaV0uZGlhcnJoZWEgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGNoYXJ0RGF0YVtpXS5kaWFycmhlYSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgYWRkSW5BcnJheShkaWFycmhlYURhdGEsdXRjRGF0ZSxjaGFydERhdGFbaV0uZGlhcnJoZWEpO1xuICAgICAgfVxuICAgICAgXG4gIFx0fVxuXG4gICAgJHRyYW5zbGF0ZShbXCJQT09cIixcImFkZF9CTE9PRFwiLFwiYWRkX0RJQVJSSEVBXCJdKS50aGVuKGZ1bmN0aW9uIHN1Y2Nlc3NGbih0cmFuc2xhdGlvbnMpIHtcbiAgICAgIGRyYXdDaGFydChmaW5hbERhdGEsIGJsb29kRGF0YSwgZGlhcnJoZWFEYXRhLCB0cmFuc2xhdGlvbnMpO1xuICAgICAgICAkaW9uaWNMb2FkaW5nLmhpZGUoKTtcbiAgICB9KTsgIFx0XG4gIH07XG5cbiAgdmFyIGFkZEluQXJyYXkgPSBmdW5jdGlvbihwQXJyYXksIHV0Y0RhdGUsIGF1Z21lbnRWYWx1ZSkge1xuICAgIHZhciBpc05ldyA9IHRydWU7XG4gICAgICBmb3IgKHZhciBqID0gMCwgayA9IHBBcnJheS5sZW5ndGg7IGogPCBrOyBqKyspIHtcbiAgICAgICAgaWYgKHBBcnJheVtqXVswXSA9PT0gdXRjRGF0ZSkge1xuICAgICAgICAgIGlzTmV3ID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGlzTmV3KSB7XG4gICAgICAgIHBBcnJheS5wdXNoKFt1dGNEYXRlLGF1Z21lbnRWYWx1ZV0pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHBBcnJheVtqXVsxXSA9IHBBcnJheVtqXVsxXSArIGF1Z21lbnRWYWx1ZTtcbiAgICAgIH0gXG4gIH07XG5cbiAgdmFyIGRyYXdDaGFydCA9IGZ1bmN0aW9uKGZpbmFsRGF0YSwgYmxvb2REYXRhLCBkaWFycmhlYURhdGEsIHRyYW5zbGF0aW9ucykge1xuICBcdG5ldyBIaWdoY2hhcnRzLkNoYXJ0KHtcbiAgICAgICAgY2hhcnQ6IHtcbiAgICAgICAgICAgIHJlbmRlclRvIDogJ2NvbnRhaW5lcicsXG4gICAgICAgICAgICB0eXBlOiAnc3BsaW5lJyxcbiAgICAgICAgICAgIHpvb21UeXBlOiAneCdcbiAgICAgICAgfSxcbiAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgIHRleHQ6ICcnXG4gICAgICAgIH0sXG4gICAgICAgIHhBeGlzOiB7XG4gICAgICAgICAgICB0eXBlOiAnZGF0ZXRpbWUnLFxuICAgICAgICAgICAgZGF0ZVRpbWVMYWJlbEZvcm1hdHM6IHsgLy8gZG9uJ3QgZGlzcGxheSB0aGUgZHVtbXkgeWVhclxuICAgICAgICAgICAgICAgIG1vbnRoOiAnJWUuICViJyxcbiAgICAgICAgICAgICAgICB5ZWFyOiAnJWInXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgICB0ZXh0OiAnJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFsbG93RGVjaW1hbHM6IGZhbHNlLFxuICAgICAgICAgICAgbWluOiAwXG4gICAgICAgIH0sXG4gICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBzZXJpZXM6IFt7XG4gICAgICAgICAgICBuYW1lOiB0cmFuc2xhdGlvbnMuUE9PLFxuICAgICAgICAgICAgdHlwZTogJ2FyZWFzcGxpbmUnLFxuICAgICAgICAgICAgLy8gRGVmaW5lIHRoZSBkYXRhIHBvaW50cy4gQWxsIHNlcmllcyBoYXZlIGEgZHVtbXkgeWVhclxuICAgICAgICAgICAgLy8gb2YgMTk3MC83MSBpbiBvcmRlciB0byBiZSBjb21wYXJlZCBvbiB0aGUgc2FtZSB4IGF4aXMuIE5vdGVcbiAgICAgICAgICAgIC8vIHRoYXQgaW4gSmF2YVNjcmlwdCwgbW9udGhzIHN0YXJ0IGF0IDAgZm9yIEphbnVhcnksIDEgZm9yIEZlYnJ1YXJ5IGV0Yy5cbiAgICAgICAgICAgIGRhdGE6IGZpbmFsRGF0YVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiB0cmFuc2xhdGlvbnMuYWRkX0JMT09ELFxuICAgICAgICAgICAgLy8gRGVmaW5lIHRoZSBkYXRhIHBvaW50cy4gQWxsIHNlcmllcyBoYXZlIGEgZHVtbXkgeWVhclxuICAgICAgICAgICAgLy8gb2YgMTk3MC83MSBpbiBvcmRlciB0byBiZSBjb21wYXJlZCBvbiB0aGUgc2FtZSB4IGF4aXMuIE5vdGVcbiAgICAgICAgICAgIC8vIHRoYXQgaW4gSmF2YVNjcmlwdCwgbW9udGhzIHN0YXJ0IGF0IDAgZm9yIEphbnVhcnksIDEgZm9yIEZlYnJ1YXJ5IGV0Yy5cbiAgICAgICAgICAgIGRhdGE6IGJsb29kRGF0YSxcbiAgICAgICAgICAgIGNvbG9yOiAnI0VGNDczQSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IHRyYW5zbGF0aW9ucy5hZGRfRElBUlJIRUEsXG4gICAgICAgICAgLy8gRGVmaW5lIHRoZSBkYXRhIHBvaW50cy4gQWxsIHNlcmllcyBoYXZlIGEgZHVtbXkgeWVhclxuICAgICAgICAgIC8vIG9mIDE5NzAvNzEgaW4gb3JkZXIgdG8gYmUgY29tcGFyZWQgb24gdGhlIHNhbWUgeCBheGlzLiBOb3RlXG4gICAgICAgICAgLy8gdGhhdCBpbiBKYXZhU2NyaXB0LCBtb250aHMgc3RhcnQgYXQgMCBmb3IgSmFudWFyeSwgMSBmb3IgRmVicnVhcnkgZXRjLlxuICAgICAgICAgIGRhdGE6IGRpYXJyaGVhRGF0YSxcbiAgICAgICAgICBjb2xvcjogJyNGRkM5MDAnXG4gICAgICAgIH1dXG4gICAgfSk7XG4gIH07XG5cbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVGFiQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgRGF0YWJhc2UpIHtcblxuICAkc2NvcGUuJG9uKFwiJGlvbmljVmlldy5iZWZvcmVFbnRlclwiLCBmdW5jdGlvbiggc2NvcGVzLCBzdGF0ZXMgKSB7XG4gICAgRGF0YWJhc2UubGFzdEVudHJ5KGZ1bmN0aW9uKGxhc3RFbnRyeSkge1xuICAgICAgJHNjb3BlLmxhc3RFbnRyeSA9IGxhc3RFbnRyeTtcbiAgICB9KTtcbiAgfSk7XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5zZXJ2aWNlcycpLmZhY3RvcnkoJ0JhY2t1cFNlcnZpY2UnLCBmdW5jdGlvbigkcSwgJGNvcmRvdmFGaWxlLCBEYXRhYmFzZSkge1xuICB2YXIgYmFja3VwRmlsZXMgPSBbXTtcblxuICByZXR1cm4ge1xuICAgIGdldEJhY2t1cEZpbGVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgIGlmIChjb3Jkb3ZhICYmIGNvcmRvdmEuZmlsZSAmJiBjb3Jkb3ZhLmZpbGUuZXh0ZXJuYWxSb290RGlyZWN0b3J5ICYmIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKSB7XG4gICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKGNvcmRvdmEuZmlsZS5leHRlcm5hbFJvb3REaXJlY3RvcnksIGZ1bmN0aW9uKGRpcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2V0IGZpbGVsaXN0XCIpO1xuICAgICAgICAgIHZhciBkaXJSZWFkZXIgPSBkaXIuY3JlYXRlUmVhZGVyKCk7XG5cbiAgICAgICAgICBkaXJSZWFkZXIucmVhZEVudHJpZXMgKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICAgIGJhY2t1cEZpbGVzID0gW107XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocmVzdWx0cykpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChyZXN1bHRzW2ldLm5hbWUuaW5kZXhPZihcIlBvb2NvdW50XCIpID49IDApIHtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3VsdHNbaV0ubmFtZSk7XG4gICAgICAgICAgICAgICAgYmFja3VwRmlsZXMucHVzaCh7bmFtZTogcmVzdWx0c1tpXS5uYW1lLCBuYXRpdmVVUkw6IHJlc3VsdHNbaV0ubmF0aXZlVVJMfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShiYWNrdXBGaWxlcyk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuXG4gICAgfSxcbiAgICBleHBvcnRCYWNrdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoY29yZG92YS5maWxlLmV4dGVybmFsUm9vdERpcmVjdG9yeSwgZnVuY3Rpb24oZGlyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXhwb3J0OiBnb3RvIHNkY2FyZFwiLGRpcik7XG4gICAgICAgIGRpci5nZXRGaWxlKFwiUG9vY291bnRCYWNrdXBfXCIgKyBtb21lbnQobmV3IERhdGUoKSkuZm9ybWF0KFwiWVlZWU1NRERfaGhtbXNzXCIpICsgXCIudHh0XCIsIHtjcmVhdGU6dHJ1ZX0sIGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcImNyZWF0ZSBmaWxlXCIsIGZpbGUpO1xuICAgICAgICAgIFxuICAgICAgICAgIGZpbGUuY3JlYXRlV3JpdGVyKGZ1bmN0aW9uKGZpbGVXcml0ZXIpIHtcblxuICAgICAgICAgICAgLy8gdXNlIHRvIGFwcGVuZFxuICAgICAgICAgICAgLy9maWxlV3JpdGVyLnNlZWsoZmlsZVdyaXRlci5sZW5ndGgpO1xuXG4gICAgICAgICAgICBEYXRhYmFzZS5hbGwoZnVuY3Rpb24oYWxsRGF0YSkge1xuXG4gICAgICAgICAgICAgIHZhciBleHBvcnRPYmplY3QgPSB7fTtcbiAgICAgICAgICAgICAgZXhwb3J0T2JqZWN0LnBvb2NvdW50REJWZXJzaW9uID0gMDtcbiAgICAgICAgICAgICAgZXhwb3J0T2JqZWN0LmRhdGEgPSBhbGxEYXRhO1xuXG4gICAgICAgICAgICAgIHZhciBibG9iID0gbmV3IEJsb2IoW0pTT04uc3RyaW5naWZ5KGV4cG9ydE9iamVjdCldLCB7dHlwZTondGV4dC9wbGFpbid9KTtcbiAgICAgICAgICAgICAgZmlsZVdyaXRlci53cml0ZShibG9iKTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGaWxlIHdyb3RlXCIpO1xuICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTsgXG5cbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvcjogXCIgKyBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGVycm9yKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuICAgIGltcG9ydEJhY2t1cDogZnVuY3Rpb24oZmlsZVVSSSkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoZmlsZVVSSSwgZnVuY3Rpb24oZmlsZUVudHJ5KSB7XG5cbiAgICAgICAgZmlsZUVudHJ5LmZpbGUoZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblxuICAgICAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgaW1wb3J0ZWREYXRhID0gSlNPTi5wYXJzZShyZWFkZXIucmVzdWx0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRmlsZWRhdGE6IFwiICsgSlNPTi5zdHJpbmdpZnkoaW1wb3J0ZWREYXRhKSk7XG5cbiAgICAgICAgICAgIERhdGFiYXNlLmltcG9ydERhdGEoaW1wb3J0ZWREYXRhLmRhdGEpO1xuICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIEpTT04uc3RyaW5naWZ5KGUpKTtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG4gICAgZGVsZXRlQmFja3VwRmlsZTogZnVuY3Rpb24oZmlsZVVSSSkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoZmlsZVVSSSwgZnVuY3Rpb24oZmlsZUVudHJ5KSB7XG5cbiAgICAgICAgZmlsZUVudHJ5LnJlbW92ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRmlsZSByZW1vdmVkLicpO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiICsgSlNPTi5zdHJpbmdpZnkoZSkpO1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChlKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuICB9O1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ3N0YXJ0ZXIuc2VydmljZXMnKS5mYWN0b3J5KCdEYXRhYmFzZScsIGZ1bmN0aW9uKCkge1xuICAvLyBNaWdodCB1c2UgYSByZXNvdXJjZSBoZXJlIHRoYXQgcmV0dXJucyBhIEpTT04gYXJyYXlcblxuICAvLyBTb21lIGZha2UgdGVzdGluZyBkYXRhXG4gIHZhciBhbGxEYXRhID0gW10sXG4gIG9uUmVhZHkgPSBudWxsLFxuICBvblJlYWR5TGFzdCA9IG51bGwsXG4gIGxhc3RJZCA9IDAsXG4gIGhhc0NoYW5nZWREYXRhID0ge307XG4gIHRoYXQgPSB0aGlzO1xuXG4gIGxvY2FsZm9yYWdlLmNvbmZpZyh7XG4gICAgZHJpdmVyOiBsb2NhbGZvcmFnZS5MT0NBTFNUT1JBR0UsXG4gICAgbmFtZTogJ3Bvb2NvdW50U3RvcmFnZSdcbiAgfSk7XG5cbiAgbG9jYWxmb3JhZ2UuZ2V0SXRlbSgnYWxsRGF0YScpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAvLyBUaGUgc2FtZSBjb2RlLCBidXQgdXNpbmcgRVM2IFByb21pc2VzLlxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgYWxsRGF0YSA9IHZhbHVlO1xuICAgICAgLy9jb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xuICAgICAgaWYgKG9uUmVhZHkpIHtcbiAgICAgICAgb25SZWFkeShhbGxEYXRhKTtcbiAgICAgIH1cbiAgICAgIGlmIChvblJlYWR5TGFzdCkge1xuICAgICAgICBvblJlYWR5TGFzdChnZXRMYXN0RW50cnkoKSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdsYXN0SWQnKS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgLy8gVGhlIHNhbWUgY29kZSwgYnV0IHVzaW5nIEVTNiBQcm9taXNlcy5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGxhc3RJZCA9IHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxhc3RJZCA9IDA7XG4gICAgfVxuICB9KTtcblxuICB2YXIgc2F2ZVRvTG9jYWxTdG9yYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgYWxsRGF0YSA9ICBfLnNvcnRCeShhbGxEYXRhLCBmdW5jdGlvbihlbG0peyByZXR1cm4gZWxtLmRhdGU7IH0pO1xuICAgIGxvY2FsZm9yYWdlLnNldEl0ZW0oJ2FsbERhdGEnLCBhbGxEYXRhKTtcbiAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdsYXN0SWQnLCBsYXN0SWQpO1xuICAgIGRhdGFDaGFuZ2VkKCk7XG4gICAgaWYgKG9uUmVhZHlMYXN0KSB7XG4gICAgICBvblJlYWR5TGFzdChnZXRMYXN0RW50cnkoKSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBnZXROZXdJZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChhbGxEYXRhLmxlbmd0aCA9PT0gMCkge1xuICAgICAgbGFzdElkID0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsYXN0SWQrKztcbiAgICB9XG5cbiAgICByZXR1cm4gbGFzdElkO1xuICB9O1xuXG4gIHZhciBnZXRJbmRleEZyb21JZCA9IGZ1bmN0aW9uKGRhdGFJZCkge1xuICAgIGZvciAodmFyIGkgPSAwLCB5ID0gYWxsRGF0YS5sZW5ndGg7IGkgPCB5OyBpKyspIHtcbiAgICAgIGlmIChhbGxEYXRhW2ldLmlkID09IGRhdGFJZCkge1xuICAgICAgICByZXR1cm4gaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhcIkluZGV4IG5vdCBmb3VuZDogXCIgKyBkYXRhSWQpO1xuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICB2YXIgZGF0YUNoYW5nZWQgPSBmdW5jdGlvbigpIHtcblxuICAgIGZvciAodmFyIHBhcmFtIGluIGhhc0NoYW5nZWREYXRhKSB7XG4gICAgICBoYXNDaGFuZ2VkRGF0YVtwYXJhbV0gPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZ2V0TGFzdEVudHJ5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGFsbERhdGFbYWxsRGF0YS5sZW5ndGgtMV07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBhbGw6IGZ1bmN0aW9uKGNiKSB7XG4gICAgICBvblJlYWR5ID0gY2I7XG4gICAgICBpZihvblJlYWR5KSB7XG4gICAgICAgIG9uUmVhZHkoYWxsRGF0YSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBsYXN0RW50cnk6IGZ1bmN0aW9uKGNiKSB7XG4gICAgICBvblJlYWR5TGFzdCA9IGNiO1xuICAgICAgaWYob25SZWFkeUxhc3QpIHtcbiAgICAgICAgb25SZWFkeUxhc3QoZ2V0TGFzdEVudHJ5KCkpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbihkYXRhSWQpIHtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4RnJvbUlkKGRhdGFJZCk7XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICByZXR1cm4gYWxsRGF0YVtpbmRleF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgZGVsZXRlRWxlbWVudDogZnVuY3Rpb24oZGF0YUlkKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRlbGV0ZTogXCIgKyBkYXRhSWQpO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhGcm9tSWQoZGF0YUlkKTtcbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGFsbERhdGEuc3BsaWNlKGluZGV4LDEpO1xuICAgICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGRlbGV0ZUFsbDogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkRlbGV0ZSBhbGxcIik7XG4gICAgICBhbGxEYXRhID0gW107XG4gICAgICBkYXRhQ2hhbmdlZCgpO1xuICAgICAgbG9jYWxmb3JhZ2UuY2xlYXIoKTtcbiAgICB9LFxuICAgIGFkZDogZnVuY3Rpb24obmV3RW50cnkpIHtcbiAgICAgIG5ld0VudHJ5LmlkID0gZ2V0TmV3SWQoKTtcbiAgICAgIGFsbERhdGEucHVzaChuZXdFbnRyeSk7XG4gICAgICBjb25zb2xlLmxvZyhuZXdFbnRyeS5pZCk7XG4gICAgICBzYXZlVG9Mb2NhbFN0b3JhZ2UoKTtcbiAgICB9LFxuICAgIGVkaXQ6IGZ1bmN0aW9uKGRhdGFJZCwgZWRpdEVudHJ5KSB7XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEZyb21JZChkYXRhSWQpO1xuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgYWxsRGF0YVtpbmRleF0gPSBlZGl0RW50cnk7XG4gICAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgaGFzQ2hhbmdlZDogZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgIGlmICh0eXBlb2YgaGFzQ2hhbmdlZERhdGFbY2hpbGRdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXR1cm4gaGFzQ2hhbmdlZERhdGFbY2hpbGRdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBnb3REYXRhOiBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaGFzQ2hhbmdlZERhdGFbY2hpbGRdID0gZmFsc2U7XG4gICAgfSxcbiAgICBpbXBvcnREYXRhOiBmdW5jdGlvbihpbXBvcnRlZERhdGEpIHtcbiAgICAgIGFsbERhdGEgPSBpbXBvcnRlZERhdGE7XG4gICAgICBsYXN0SWQgPSBfLnNvcnRCeShpbXBvcnRlZERhdGEsIGZ1bmN0aW9uKGVsbSl7IHJldHVybiBlbG0uaWQ7IH0pW2ltcG9ydGVkRGF0YS5sZW5ndGgtMV0uaWQ7XG4gICAgICBjb25zb2xlLmxvZyhcImxhc3RJZCBhZnRlciBpbXBvcnQ6IFwiICsgbGFzdElkKTtcbiAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgpO1xuICAgIH0sXG4gICAgY3JlYXRlRGVtb0RhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgYWxsRGF0YSA9IFtdO1xuICAgICAgdmFyIGN1cnJlbnREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgIHZhciBlbnRyeXNQZXJEYXkgPSA0O1xuXG4gICAgICBmb3IodmFyIGk9MDsgaTwzNjA7IGkrKykge1xuICAgICAgICB2YXIgbmV3RW50cnlzUGVyRGF5ID0gTWF0aC5yYW5kb20oKSAqICg3IC0gMSkgKyAxO1xuICAgICAgICBpZiAobmV3RW50cnlzUGVyRGF5ID4gZW50cnlzUGVyRGF5KSB7XG4gICAgICAgICAgZW50cnlzUGVyRGF5Kys7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobmV3RW50cnlzUGVyRGF5IDwgZW50cnlzUGVyRGF5KSB7XG4gICAgICAgICAgZW50cnlzUGVyRGF5LS07XG4gICAgICAgIH1cblxuICAgICAgICBmb3IodmFyIGo9MDsgajxlbnRyeXNQZXJEYXk7IGorKykge1xuICAgICAgICAgIC8vY29uc29sZS5sb2cobmV3IERhdGUoY3VycmVudERhdGUpKTtcbiAgICAgICAgICAvL3ZhciBuZXdEYXRlID0gbW9tZW50KGN1cnJlbnREYXRlICsgXCIgXCIgKyBcIjA4OjMwXCIsIFwiTU0vREQvWVlZWSBISDptbVwiKS50b0RhdGUoKTtcbiAgICAgICAgICBhbGxEYXRhLnB1c2goeyBpZCA6IGdldE5ld0lkKCksIGRhdGUgOiBtb21lbnQobmV3IERhdGUoY3VycmVudERhdGUpKS50b0RhdGUoKSwgdGltZSA6IFwiMDg6MzBcIiwgdHlwZSA6IFwicG9vXCIsIGJsb29kIDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMiksIGRpYXJyaGVhIDogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMil9KTtcblxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnREYXRlLnNldERhdGUoY3VycmVudERhdGUuZ2V0RGF0ZSgpIC0gMSk7XG4gICAgICB9XG5cbiAgICAgIHNhdmVUb0xvY2FsU3RvcmFnZSgpO1xuICAgIH1cbiAgfTtcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdzdGFydGVyLnNlcnZpY2VzJykuZmFjdG9yeSgnTGlzdFNlcnZpY2UnLCBmdW5jdGlvbihEYXRhYmFzZSwgJHEpIHtcbiAgLy8gTWlnaHQgdXNlIGEgcmVzb3VyY2UgaGVyZSB0aGF0IHJldHVybnMgYSBKU09OIGFycmF5XG5cbiAgLy8gU29tZSBmYWtlIHRlc3RpbmcgZGF0YVxuICB2YXIgYWxsRGF0YSA9IFtdLFxuICAgIGdyb3VwcyA9IFtdLFxuICAgIGxvYWRlZCA9IGZhbHNlO1xuICAgIHRoYXQgPSB0aGlzO1xuXG4gIHZhciBjcmVhdGVEYXRlR3JvdXBzID0gZnVuY3Rpb24oYWxsRGF0YSkge1xuICAgIHZhciB0bXBHcm91cHMgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwLCB5ID0gYWxsRGF0YS5sZW5ndGg7IGkgPCB5OyBpKyspIHtcbiAgICAgIGFsbERhdGFbaV0uZGF0ZSA9IG5ldyBEYXRlKGFsbERhdGFbaV0uZGF0ZSk7XG4gICAgICBhZGRJbkFycmF5KHRtcEdyb3VwcywgbW9tZW50KGFsbERhdGFbaV0uZGF0ZSkuZm9ybWF0KCdERC9NTS9ZWVlZJyksIG1vbWVudChhbGxEYXRhW2ldLmRhdGUpLnRvRGF0ZSgpLCBhbGxEYXRhW2ldKTtcbiAgICB9XG5cbiAgICB0aGF0Lmdyb3VwcyA9IHRtcEdyb3VwcztcbiAgfTtcblxuICB2YXIgYWRkSW5BcnJheSA9IGZ1bmN0aW9uKHBBcnJheSwgY2hlY2tEYXRlLCBkYXRlLCBlbGVtZW50KSB7XG4gICAgdmFyIGlzTmV3ID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBqID0gMCwgayA9IHBBcnJheS5sZW5ndGg7IGogPCBrOyBqKyspIHtcbiAgICAgIGlmIChwQXJyYXlbal0uY2hlY2tEYXRlID09PSBjaGVja0RhdGUpIHtcbiAgICAgICAgaXNOZXcgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzTmV3KSB7XG4gICAgICBwQXJyYXkucHVzaCh7XG4gICAgICAgIGNoZWNrRGF0ZTogY2hlY2tEYXRlLFxuICAgICAgICBkYXRlOiBkYXRlLFxuICAgICAgICBwb286IGVsZW1lbnQudHlwZSA9PSAncG9vJyA/IDEgOiAwLFxuICAgICAgICBub3RlczogZWxlbWVudC50eXBlID09ICdub3RlJyA/IDEgOiAwLFxuICAgICAgICBibG9vZDogZWxlbWVudC5ibG9vZCxcbiAgICAgICAgaXRlbXM6IFtlbGVtZW50XVxuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgcEFycmF5W2pdLmJsb29kICs9IGVsZW1lbnQuYmxvb2Q7XG4gICAgICBpZiAoZWxlbWVudC50eXBlID09ICdwb28nKSB7XG4gICAgICAgIHBBcnJheVtqXS5wb28gKz0gMTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGVsZW1lbnQudHlwZSA9PSAnbm90ZScpIHtcbiAgICAgICAgcEFycmF5W2pdLm5vdGVzICs9IDE7XG4gICAgICB9XG4gICAgICBwQXJyYXlbal0uaXRlbXMucHVzaChlbGVtZW50KTtcbiAgICB9XG4gIH07XG5cblxuICB2YXIgaW5pdExpc3RTZXJ2aWNlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgIGlmICghbG9hZGVkIHx8IERhdGFiYXNlLmhhc0NoYW5nZWQoJ2xpc3RTZXJ2aWNlJykpIHtcbiAgICAgIERhdGFiYXNlLmFsbChmdW5jdGlvbihhbGxEYXRhKSB7XG4gICAgICAgIGFsbERhdGEgPSBhbGxEYXRhLnNsaWNlKCkucmV2ZXJzZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNhbGxiYWNrIG9uRGF0YVJlYWR5IGZvciBsaXN0IHNlcnZpY2VcIiwgYWxsRGF0YSk7XG5cbiAgICAgICAgaWYoYWxsRGF0YS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY3JlYXRlRGF0ZUdyb3VwcyhhbGxEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxvYWRlZCA9IHRydWU7XG4gICAgICAgIERhdGFiYXNlLmdvdERhdGEoJ2xpc3RTZXJ2aWNlJyk7XG5cbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgIH1cblxuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0TGlzdFNlcnZpY2U6IGluaXRMaXN0U2VydmljZSxcbiAgICBnZXREYXlzTGlzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhhdC5ncm91cHM7XG4gICAgfSxcbiAgICBnZXREYXlMaXN0OiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgcmV0dXJuIHRoYXQuZ3JvdXBzW2luZGV4XTtcbiAgICB9XG4gIH07XG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnc3RhcnRlci5zZXJ2aWNlcycpLmZhY3RvcnkoJ1NldHRpbmdzU2VydmljZScsIGZ1bmN0aW9uKCRxKSB7XG4gIHZhciBsYW5ndWFnZSA9IFwiXCIsXG4gIGxhbmd1YWdlSXNTZXQgPSBmYWxzZSxcbiAgc2hvd0RpYXJyaGVhID0gZmFsc2U7XG5cbiAgbG9jYWxmb3JhZ2UuY29uZmlnKHtcbiAgICBkcml2ZXI6IGxvY2FsZm9yYWdlLkxPQ0FMU1RPUkFHRSxcbiAgICBuYW1lOiAncG9vY291bnRTdG9yYWdlJ1xuICB9KTtcblxuICBsb2NhbGZvcmFnZS5nZXRJdGVtKCdzaG93RGlhcnJoZWEnKS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBzaG93RGlhcnJoZWEgPSB2YWx1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0TGFuZ3VhZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGxhbmd1YWdlO1xuICAgIH0sXG4gICAgc2V0TGFuZ3VhZ2U6IGZ1bmN0aW9uKG5ld0xhbmd1YWdlKSB7XG4gICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdsYW5ndWFnZScsIG5ld0xhbmd1YWdlKTtcbiAgICAgIGxhbmd1YWdlID0gbmV3TGFuZ3VhZ2U7XG4gICAgfSxcbiAgICBpbml0U2V0dGluZ3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGNvdWxkIEkgbW92ZSB0aGlzIGp1c3Qgb24gdG9wIGxpa2Ugd2l0aCBzaG93RGlhcnJoZWE/PyB0byB0ZXN0XG5cbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgIGxvY2FsZm9yYWdlLmdldEl0ZW0oJ2xhbmd1YWdlJykudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICBsYW5ndWFnZSA9IHZhbHVlO1xuICAgICAgICAgIGxhbmd1YWdlSXNTZXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuICAgIGdldFNob3dEaWFycmhlYTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHNob3dEaWFycmhlYTtcbiAgICB9LFxuICAgIHNldFNob3dEaWFycmhlYTogZnVuY3Rpb24obmV3U2hvd0RpYXJyaGVhKSB7XG4gICAgICBsb2NhbGZvcmFnZS5zZXRJdGVtKCdzaG93RGlhcnJoZWEnLCBuZXdTaG93RGlhcnJoZWEpO1xuICAgICAgc2hvd0RpYXJyaGVhID0gbmV3U2hvd0RpYXJyaGVhO1xuICAgIH1cbiAgfTtcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==