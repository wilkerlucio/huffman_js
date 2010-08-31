module.exports.TreeBuilder = require("./tree_builder");
module.exports.Tree = require("./tree");
module.exports.treeFromText = function(text, callback) {
  var builder;
  builder = new module.exports.TreeBuilder(text);
  return builder.build(callback);
};