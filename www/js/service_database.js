angular.module('starter.services').factory('Database', function() {
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
    },
    createDemoData: function() {
      allData = [];
      var currentDate = new Date();
      var entrysPerDay = 2;

      for(var i=0; i<30; i++) {
        entrysPerDay = Math.random() * (7 - 1) + 1;

        for(var j=0; j<entrysPerDay; j++) {
          //console.log(new Date(currentDate));
          //var newDate = moment(currentDate + " " + "08:30", "MM/DD/YYYY HH:mm").toDate();
          allData.push({ id : getNewId(), date : moment(new Date(currentDate)).format('MM/DD/YYYY'), time : "08:30", type : "poo", blood : Math.floor(Math.random() * 2)});

        }
        currentDate.setDate(currentDate.getDate() - 1);
      }

      saveToLocalStorage();
    }
  };
});