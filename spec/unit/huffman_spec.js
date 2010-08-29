describe 'Huffman'
  describe 'encoding / decoding'
		before
			text = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
			encoder = Huffman.treeFromText(text)
		end
		
    it 'should get same result after decoding'
      encoded = encoder.encode(text)
			encoder.decode(encoded).should.eql(text)
    end

		it "should reduce size on encoding"
			encoder.encode(text).length.should.be_less_than(text.length)
		end
  end

	describe "TreeBuilder"
		it "should generate frequency table"
			builder = new Huffman.TreeBuilder("aaabbcccc")
			builder.buildFrequencyTable().should.eql [[2, 'b'], [3, 'a'], [4, 'c']]
		end
		
		it "should combine table"
			table = [[2, 'b'], [5, 'd'], [6, 'a']]
			builder = new Huffman.TreeBuilder("")
			builder.combineTable(table).should.eql [13, [[6, 'a'], [7, [[2, 'b'], [5, 'd']]]]]
		end
		
		it "should compress combined table"
			combined = [13, [[6, 'a'], [7, [[2, 'b'], [5, 'd']]]]]
			builder = new Huffman.TreeBuilder("")
			builder.compressCombinedTable(combined).should.eql ['a', ['b', 'd']]
		end
		
		it "should generate the tree"
			builder = new Huffman.TreeBuilder("aaabbcccc")
			tree = builder.build()
			tree.root.left.value.should.eql 'c'
			tree.root.right.left.value.should.eql 'b'
			tree.root.right.right.value.should.eql 'a'
		end
	end
	
	describe "Tree"
		before_each
			combined = ['a', ['b', 'd']]
			tree = Huffman.Tree.decodeTree(combined)
		end
		
		it "should decode a custom formated tree"
			ctree = Huffman.Tree.decodeTree([['a', 'b'], ['c', 'd']])
			
			ctree.root.left.left.value.should.eql 'a'
			ctree.root.left.right.value.should.eql 'b'
			ctree.root.right.left.value.should.eql 'c'
			ctree.root.right.right.value.should.eql 'd'
		end
		
		it "should decode tree"
			tree.root.left.value.should.eql 'a'
			tree.root.right.left.value.should.eql 'b'
			tree.root.right.right.value.should.eql 'd'
		end
		
		it "should encode tree"
			tree.encodeTree().should.eql ['a', ['b', 'd']]
		end
		
		it "should generate the bit string"
			tree.encodeBitString("aabdaaaadb").should.eql "00101100001110"
		end
		
		it "should convert bit string to string"
			resultString = String.fromCharCode(44) + String.fromCharCode(56) + "2"
			tree.bitStringToString("00101100001110").should.eql resultString
		end
		
		it "should decode bit string to plain bits"
			resultString = String.fromCharCode(44) + String.fromCharCode(56) + "2"
			tree.stringToBitString(resultString).should.eql "00101100001110"
		end
		
		it "should encode process"
			tree.encode("aabdaaaadb").should.eql (String.fromCharCode(44) + String.fromCharCode(56) + "2")
		end
		
		it "should decode process"
			tree.decode(String.fromCharCode(44) + String.fromCharCode(56) + "2").should.eql "aabdaaaadb"
		end
	end
	
	describe "Core Helpers"
		it "should left pad strings"
			Huffman.CoreHelpers.lpad("001", 8).should.be "00000001"
		end
	end
end