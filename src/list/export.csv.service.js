angular.module('starter.services').factory('ExportCsvService', function($q, $cordovaFile, Database, $window) {

  return {
    exportCsv: function() {
      var deferred = $q.defer();

      $window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
        console.log("Export: goto sdcard",dir);
        dir.getFile("PoocountCSVexport_" + moment(new Date()).format("YYYYMMDD_hhmmss") + ".txt", {create:true}, function(file) {
          console.log("create file", file);
          
          file.createWriter(function(fileWriter) {

            Database.all(function(allData) {

              var exportObject = {};
              exportObject.data = allData;

              var blob = new Blob([angular.fromJSON(exportObject)], {type:'text/plain'});
              fileWriter.write(blob);
              console.log("File wrote");
              deferred.resolve();
            }); 

          }, function(error) {
            console.log("Error: " + angular.fromJSON(error));
            deferred.reject(error);
          });

        });
      });

      return deferred.promise;
    }
  };
});