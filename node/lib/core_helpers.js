module.exports = {
  isArray: function(obj) {
    return !!(obj && obj.constructor === Array);
  },
  lpad: function(string, length) {
    length = length || 8;
    while (string.length < length) {
      string = "0" + string;
    }
    return string;
  },
  asyncLoop: function(fn) {
    var fnBound, n;
    n = null;
    fnBound = function() {
      return fn(n);
    };
    n = function() {
      return process.nextTick(fnBound);
    };
    return fnBound();
  }
};