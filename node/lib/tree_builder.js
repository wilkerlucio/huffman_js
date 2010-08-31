var TreeBuilder, asyncLoop, huffmanTree, isArray;
var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  }, __hasProp = Object.prototype.hasOwnProperty;
asyncLoop = require("./core_helpers").asyncLoop;
isArray = require("./core_helpers").isArray;
huffmanTree = require("./tree");
TreeBuilder = function(_a) {
  this.text = _a;
  return this;
};
TreeBuilder.prototype.build = function(callback) {
  return this.buildFrequencyTable(__bind(function(frequencyTable) {
    return this.combineTable(frequencyTable, __bind(function(combinedList) {
      return this.compressCombinedTable(combinedList, function(compressed) {
        return huffmanTree.decodeTree(compressed, callback);
      });
    }, this));
  }, this));
};
TreeBuilder.prototype.buildFrequencyTable = function(callback) {
  var i, tableHash;
  tableHash = {};
  i = 0;
  return asyncLoop(__bind(function(next) {
    var _a, chr, frequency, table;
    if (i < this.text.length) {
      chr = this.text.charAt(i);
      tableHash[chr] = (typeof tableHash[chr] !== "undefined" && tableHash[chr] !== null) ? tableHash[chr] : 0;
      tableHash[chr] += 1;
      i++;
      return next();
    } else {
      table = [];
      _a = tableHash;
      for (chr in _a) {
        if (!__hasProp.call(_a, chr)) continue;
        frequency = _a[chr];
        table.push([frequency, chr]);
      }
      table.sort(this.frequencySorter);
      return callback(table);
    }
  }, this));
};
TreeBuilder.prototype.frequencySorter = function(a, b) {
  return a[0] > b[0] ? 1 : (a[0] < b[0] ? -1 : 0);
};
TreeBuilder.prototype.combineTable = function(table, callback) {
  return asyncLoop(function(next) {
    var first, second;
    if (table.length > 1) {
      first = table.shift();
      second = table.shift();
      table.push([first[0] + second[0], [first, second]]);
      table.sort(this.frequencySorter);
      return next();
    } else {
      return callback(table[0]);
    }
  });
};
TreeBuilder.prototype.compressCombinedTable = function(table, cb) {
  var combineValue;
  combineValue = function(value, callback) {
    return isArray(value) ? process.nextTick(function() {
      return combineValue(value[0][1], function(v0) {
        return combineValue(value[1][1], function(v1) {
          return callback([v0, v1]);
        });
      });
    }) : callback(value);
  };
  return combineValue(table[1], cb);
};
module.exports = TreeBuilder;