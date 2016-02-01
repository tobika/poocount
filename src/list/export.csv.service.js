angular.module('starter.services').factory('ExportCsvService', function($q, $cordovaFile, Database, $window) {

  return {
    exportCsv: function() {


      var deferred = $q.defer();

      $window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
        console.log("Export: goto sdcard",dir);
        dir.getFile("PoocountBackup_" + moment(new Date()).format("YYYYMMDD_hhmmss") + ".csv", {create:true}, function(file) {
          console.log("create file", file);

          file.createWriter(function(fileWriter) {

            // use to append
            //fileWriter.seek(fileWriter.length);

            Database.all(function(allData) {

              var exportObject = {};
              exportObject = allData;

              var data = Papa.unparse(exportObject);

              var blob = new Blob([data], {type:'text/plain'});
              fileWriter.write(blob);

              //console.log(data);
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