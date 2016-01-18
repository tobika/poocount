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
        //console.log("Callback onDataReady for list service", allData);

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