Huffman.CoreHelpers = {
  isArray: function(obj) {
    return !!(obj && obj.constructor === Array);
  },
  lpad: function(string, length) {
    length = length || 8;
    while (string.length < length) {
      string = "0" + string;
    }
    return string;
  }
};