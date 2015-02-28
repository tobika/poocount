angular.module('starter.services', ['ngCordova'])

/**
 * A simple example service that returns some data.
 */
 .factory('Database', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var allData = [],
  onReady = null,
  lastId = 0,
  listDataChanged = true,
  statsDataChanged = true,
  that = this;

  localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: 'poocountStorage'
  });

  localforage.getItem('allData').then(function(value) {
    // The same code, but using ES6 Promises.
    if (value) {
      allData = value;
      console.log(JSON.stringify(value));
      if (onReady) {
        onReady(allData);
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
    listDataChanged = true;
    statsDataChanged = true;
  };

  return {
    all: function(cb) {
      onReady = cb;
      if(onReady) {
        onReady(allData);
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
    hasListDataChanged: function() {
      return listDataChanged;
    },
    hasStatsDataChanged: function() {
      return statsDataChanged;
    },
    gotListData: function() {
      listDataChanged = false;
    },
    gotStatsData: function() {
      statsDataChanged = false;
    },
    importData: function(importedData) {
      allData = importedData;
      lastId = _.sortBy(importedData, function(elm){ return elm.id; })[importedData.length-1].id;
      console.log("lastId after import: " + lastId);
      saveToLocalStorage();
    }
  };
})

.factory('LanguageService', function($q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var language = "",
  languageIsSet = false;

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
    initLanguage: function () {
      var deferred = $q.defer();

      localforage.getItem('language').then(function(value) {
        // The same code, but using ES6 Promises.
        if (value) {
          language = value;
          languageIsSet = true;
        }
        deferred.resolve();
      });

      return deferred.promise;
    }
  };
})

.factory('BackupService', function($q, $cordovaFile, Database) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
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