var Huffman;
Huffman = {
  treeFromText: function(text) {
    var builder;
    builder = new Huffman.TreeBuilder(text);
    return builder.build();
  }
};