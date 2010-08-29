var __hasProp = Object.prototype.hasOwnProperty;
Huffman.TreeBuilder = function(_a) {
  this.text = _a;
  return this;
};
Huffman.TreeBuilder.prototype.build = function() {
  var combinedList, frequencyTable;
  frequencyTable = this.buildFrequencyTable();
  combinedList = this.combineTable(frequencyTable);
  return Huffman.Tree.decodeTree(this.compressCombinedTable(combinedList));
};
Huffman.TreeBuilder.prototype.buildFrequencyTable = function() {
  var _a, _b, _c, _d, chr, frequency, table, tableHash;
  tableHash = {};
  _b = this.text.split('');
  for (_a = 0, _c = _b.length; _a < _c; _a++) {
    chr = _b[_a];
    tableHash[chr] = (typeof tableHash[chr] !== "undefined" && tableHash[chr] !== null) ? tableHash[chr] : 0;
    tableHash[chr] += 1;
  }
  table = [];
  _d = tableHash;
  for (chr in _d) {
    if (!__hasProp.call(_d, chr)) continue;
    frequency = _d[chr];
    table.push([frequency, chr]);
  }
  table.sort(this.frequencySorter);
  return table;
};
Huffman.TreeBuilder.prototype.frequencySorter = function(a, b) {
  return a[0] > b[0] ? 1 : (a[0] < b[0] ? -1 : 0);
};
Huffman.TreeBuilder.prototype.combineTable = function(table) {
  var first, second;
  while (table.length > 1) {
    first = table.shift();
    second = table.shift();
    table.push([first[0] + second[0], [first, second]]);
    table.sort(this.frequencySorter);
  }
  return table[0];
};
Huffman.TreeBuilder.prototype.compressCombinedTable = function(table) {
  var value;
  value = table[1];
  return Huffman.CoreHelpers.isArray(value) ? [this.compressCombinedTable(value[0]), this.compressCombinedTable(value[1])] : value;
};