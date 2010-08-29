Huffman.Tree = function(_a) {
  this.root = _a;
  this.root = this.root || new Huffman.Tree.Node();
  return this;
};
Huffman.Tree.prototype.encode = function(text) {
  return this.bitStringToString(this.encodeBitString(text));
};
Huffman.Tree.prototype.decode = function(text) {
  var _a, _b, _c, bitString, d, decoded, direction, node;
  bitString = this.stringToBitString(text);
  decoded = "";
  node = this.root;
  _b = bitString.split('');
  for (_a = 0, _c = _b.length; _a < _c; _a++) {
    direction = _b[_a];
    d = direction === '0' ? 'left' : 'right';
    node = node[d];
    if (node.isLeaf()) {
      decoded += node.value;
      node = this.root;
    }
  }
  return decoded;
};
Huffman.Tree.prototype.encodeBitString = function(text) {
  var _a, _b, _c, chr, encoded;
  encoded = "";
  _b = text.split('');
  for (_a = 0, _c = _b.length; _a < _c; _a++) {
    chr = _b[_a];
    encoded += this.bitValue(chr);
  }
  return encoded;
};
Huffman.Tree.prototype.bitStringToString = function(bitString) {
  var _a, _b, encoded, i, padByte;
  padByte = 8 - bitString.length % 8;
  for (i = 0; (0 <= padByte ? i < padByte : i > padByte); (0 <= padByte ? i += 1 : i -= 1)) {
    bitString += "0";
  }
  encoded = (function() {
    _a = []; _b = bitString.length;
    for (i = 0; (0 <= _b ? i < _b : i > _b); i += 8) {
      _a.push(String.fromCharCode(parseInt(bitString.substr(i, 8), 2)));
    }
    return _a;
  })();
  return encoded.join('') + padByte.toString();
};
Huffman.Tree.prototype.stringToBitString = function(bitString) {
  var _a, _b, _c, _d, chr, pad, pieces;
  pieces = bitString.split('');
  pad = parseInt(pieces.pop());
  pieces = (function() {
    _a = []; _c = pieces;
    for (_b = 0, _d = _c.length; _b < _d; _b++) {
      chr = _c[_b];
      _a.push(Huffman.CoreHelpers.lpad(chr.charCodeAt(0).toString(2)));
    }
    return _a;
  })();
  pieces = pieces.join('');
  return pieces.substr(0, pieces.length - pad);
};
Huffman.Tree.prototype.bitValue = function(chr) {
  var _a;
  if (!((typeof (_a = this.leafCache) !== "undefined" && _a !== null))) {
    this.generateLeafCache();
  }
  return this.leafCache[chr];
};
Huffman.Tree.prototype.generateLeafCache = function(node, path) {
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
Huffman.Tree.prototype.encodeTree = function() {
  return this.root.encode();
};
Huffman.Tree.decodeTree = function(data) {
  return new Huffman.Tree(Huffman.Tree.parseNode(data));
};
Huffman.Tree.parseNode = function(data) {
  var node;
  node = new Huffman.Tree.Node();
  if (Huffman.CoreHelpers.isArray(data)) {
    node.left = Huffman.Tree.parseNode(data[0]);
    node.right = Huffman.Tree.parseNode(data[1]);
  } else {
    node.value = data;
  }
  return node;
};
Huffman.Tree.Node = function() {
  this.left = (this.right = (this.value = null));
  return this;
};
Huffman.Tree.Node.prototype.isLeaf = function() {
  return (this.left === this.right) && (this.right === null);
};
Huffman.Tree.Node.prototype.encode = function() {
  return this.value ? this.value : [this.left.encode(), this.right.encode()];
};