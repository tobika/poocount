angular.module('starter.services').factory('BackupService', function($q, $cordovaFile, Database, $window) {
  var backupFiles = [];

  return {
    getBackupFiles: function() {
      var deferred = $q.defer();

      if (cordova && cordova.file && cordova.file.externalRootDirectory && $window.resolveLocalFileSystemURL) {
        $window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
          console.log("Get filelist");
          var dirReader = dir.createReader();

          dirReader.readEntries (function(results) {
            backupFiles = [];

            //console.log(angular.fromJson(results));
            for (var i = 0; i < results.length; i++) {
              if (results[i].name.indexOf("Poocount") >= 0 && results[i].name.indexOf(".txt") >= 0) {
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

      $window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
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

              var blob = new Blob([angular.toJson(exportObject)], {type:'text/plain'});
              fileWriter.write(blob);
              console.log("File wrote");
              deferred.resolve();
            }); 

          }, function(error) {
            console.log("Error: " + angular.fromJson(error));
            deferred.reject(error);
          });

        });
      });

      return deferred.promise;
    },
    importBackup: function(fileURI) {
      var deferred = $q.defer();

      $window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {

        fileEntry.file(function(file) {
           var reader = new FileReader();

          reader.onloadend = function(e) {
            var importedData = angular.fromJson(reader.result);
            //console.log("Filedata: " + angular.toJson(importedData));

            Database.importData(importedData.data);
            deferred.resolve();
          };
          reader.onerror = function(e) {
            console.log("Error: " + angular.toJson(e));
            deferred.reject(e);
          };

          reader.readAsText(file);
        });

    });

      return deferred.promise;
    },
    deleteBackupFile: function(fileURI) {
      var deferred = $q.defer();

      $window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {

        fileEntry.remove(function() {
          console.log('File removed.');
          deferred.resolve();
        }, function(e) {
          console.log("Error: " + angular.fromJson(e));
          deferred.reject(e);
        });
      });

      return deferred.promise;
    }
  };
});