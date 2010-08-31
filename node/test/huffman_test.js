huffman = require("huffman")

testTree = function(callback) {
	huffman.Tree.decodeTree(['a', ['b', 'd']], callback);
}

lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

tests = {
	"test encoding and decoding a text": function(test) {
		huffman.treeFromText(lorem, function(tree) {
			test.expect(2);
			
			tree.encode(lorem, function(encoded) {
				test.ok(encoded.length < lorem.length);
				
				tree.decode(encoded, function(decoded) {
					test.same(decoded, lorem);
					test.done();
				});
			});
		});
	},
	
	"test tree builder frequency table generator": function(test) {
		builder = new huffman.TreeBuilder("aaabbcccc")
		builder.buildFrequencyTable(function(table) {
			test.same(table, [[2, 'b'], [3, 'a'], [4, 'c']]);
			test.done();
		});
	},
	
	"test tree builder combining table": function(test) {
		table = [[2, 'b'], [5, 'd'], [6, 'a']];
		builder = new huffman.TreeBuilder("");
		builder.combineTable(table, function(combined) {
			test.same(combined, [13, [[6, 'a'], [7, [[2, 'b'], [5, 'd']]]]]);
			test.done();
		});
	},
	
	"test tree builder compressing combined table": function(test) {
		combined = [13, [[6, 'a'], [7, [[2, 'b'], [5, 'd']]]]];
		builder = new huffman.TreeBuilder("");
		builder.compressCombinedTable(combined, function(compressed) {
			test.same(compressed, ['a', ['b', 'd']]);
			test.done()
		});
	},
	
	"test generating tree from text": function(test) {
		test.expect(3);
		
		builder = new huffman.TreeBuilder("aaabbcccc");
		builder.build(function(tree) {
			test.same(tree.root.left.value, 'c');
			test.same(tree.root.right.left.value, 'b');
			test.same(tree.root.right.right.value, 'a');
			test.done();
		});
	},
	
	"test decoding a tree from a custom format": function(test) {
		test.expect(4);
		
		huffman.Tree.decodeTree([['a', 'b'], ['c', 'd']], function(tree) {
			test.same(tree.root.left.left.value, 'a');
			test.same(tree.root.left.right.value, 'b');
			test.same(tree.root.right.left.value, 'c');
			test.same(tree.root.right.right.value, 'd');
			test.done();
		});
	},
	
	"test encoding tree": function(test) {
		testTree(function(tree) {
			tree.encodeTree(function(encoded) {
				test.same(encoded, ['a', ['b', 'd']]);
				test.done();
			});
		});
	},
	
	"test tree generating bit string": function(test) {
		testTree(function(tree) {
			tree.encodeBitString("aabdaaaadb", function(encoded) {
				test.same(encoded, "00101100001110");
				test.done();
			});
		});
	},
	
	"test tree converting a bit string to string": function(test) {
		resultString = String.fromCharCode(44) + String.fromCharCode(56) + "2";
		
		testTree(function(tree) {
			tree.bitStringToString("00101100001110", function(str) {
				test.same(str, resultString);
				test.done();
			});
		});
	},
	
	"test tree converting a string to a bit string": function(test) {
		resultString = String.fromCharCode(44) + String.fromCharCode(56) + "2";
		
		testTree(function(tree) {
			tree.stringToBitString(resultString, function(bitString) {
				test.same(bitString, "00101100001110");
				test.done();
			});
		});
	},
	
	"test encoding process": function(test) {
		testTree(function(tree) {
			tree.encode("aabdaaaadb", function(encoded) {
				test.same(encoded, String.fromCharCode(44) + String.fromCharCode(56) + "2");
				test.done();
			});
		});
	},
	
	"test decoding process": function(test) {
		testTree(function(tree) {
			tree.decode(String.fromCharCode(44) + String.fromCharCode(56) + "2", function(decoded) {
				test.same(decoded, "aabdaaaadb");
				test.done();
			});
		});
	}
};

module.exports = tests