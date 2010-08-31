var Node, Tree, asyncLoop, isArray, lpad;
var __bind = function(func, context) {
    return function(){ return func.apply(context, arguments); };
  };
asyncLoop = require("./core_helpers").asyncLoop;
isArray = require("./core_helpers").isArray;
lpad = require("./core_helpers").lpad;
Tree = function(_a) {
  this.root = _a;
  this.root = this.root || new Node();
  return this;
};
Tree.prototype.encode = function(text, callback) {
  return this.encodeBitString(text, __bind(function(bitString) {
    return this.bitStringToString(bitString, function(encoded) {
      return callback(encoded);
    });
  }, this));
};
Tree.prototype.decode = function(text, callback) {
  return this.stringToBitString(text, __bind(function(bitString) {
    var decoded, i, node;
    decoded = "";
    node = this.root;
    i = 0;
    return asyncLoop(__bind(function(next) {
      var d;
      if (i < bitString.length) {
        d = bitString.charAt(i) === '0' ? 'left' : 'right';
        node = node[d];
        if (node.isLeaf()) {
          decoded += node.value;
          node = this.root;
        }
        i++;
        return next();
      } else {
        return callback(decoded);
      }
    }, this));
  }, this));
};
Tree.prototype.encodeBitString = function(text, callback) {
  var encoded, i;
  encoded = "";
  i = 0;
  return asyncLoop(__bind(function(next) {
    if (i < text.length) {
      encoded += this.bitValue(text.charAt(i));
      i++;
      return next();
    } else {
      return callback(encoded);
    }
  }, this));
};
Tree.prototype.bitStringToString = function(bitString, callback) {
  var encoded, i, padByte;
  padByte = 8 - bitString.length % 8;
  for (i = 0; (0 <= padByte ? i < padByte : i > padByte); (0 <= padByte ? i += 1 : i -= 1)) {
    bitString += "0";
  }
  i = 0;
  encoded = "";
  return asyncLoop(function(next) {
    if (i < bitString.length) {
      encoded += String.fromCharCode(parseInt(bitString.substr(i, 8), 2));
      i += 8;
      return next();
    } else {
      encoded += padByte.toString();
      return callback(encoded);
    }
  });
};
Tree.prototype.stringToBitString = function(bitString, callback) {
  var i, pad, pieces;
  pieces = bitString.split('');
  pad = parseInt(pieces.pop());
  i = 0;
  return asyncLoop(function(next) {
    var chr;
    if (i < pieces.length) {
      chr = pieces[i];
      pieces[i] = lpad(chr.charCodeAt(0).toString(2));
      i++;
      return next();
    } else {
      pieces = pieces.join('');
      pieces = pieces.substr(0, pieces.length - pad);
      return callback(pieces);
    }
  });
};
Tree.prototype.bitValue = function(chr) {
  var _a;
  if (!((typeof (_a = this.leafCache) !== "undefined" && _a !== null))) {
    this.generateLeafCache();
  }
  return this.leafCache[chr];
};
Tree.prototype.generateLeafCache = function(node, path) {
  this.leafCache = (typeof this.leafCache !== "undefined" && this.leafCache !== null) ? this.leafCache : {};
  node = node || this.root;
  path = path || "";
  if (node.isLeaf()) {
    return (this.leafCache[node.value] = path);
  } else {
    this.generateLeafCache(node.left, path + "0");
    return this.generateLeafCache(node.right, path + "1");
  }
};
Tree.prototype.encodeTree = function(callback) {
  return this.root.encode(callback);
};
Tree.decodeTree = function(data, callback) {
  return Tree.parseNode(data, function(root) {
    return callback(new Tree(root));
  });
};
Tree.parseNode = function(data, callback) {
  var node;
  node = new Node();
  if (isArray(data)) {
    return process.nextTick(function() {
      return Tree.parseNode(data[0], function(n1) {
        return Tree.parseNode(data[1], function(n2) {
          node.left = n1;
          node.right = n2;
          return callback(node);
        });
      });
    });
  } else {
    node.value = data;
    return callback(node);
  }
};
Node = function() {
  this.left = (this.right = (this.value = null));
  return this;
};
Node.prototype.isLeaf = function() {
  return (this.left === this.right) && (this.right === null);
};
Node.prototype.encode = function(callback) {
  return this.value ? callback(this.value) : process.nextTick(__bind(function() {
    return this.left.encode(__bind(function(l) {
      return this.right.encode(function(r) {
        return callback([l, r]);
      });
    }, this));
  }, this));
};
module.exports = Tree;