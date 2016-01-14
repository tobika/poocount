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