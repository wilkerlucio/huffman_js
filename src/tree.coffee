# Copyright (c) 2010 Wilker Lúcio <wilkerlucio@gmail.com>
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#    http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Huffman Tree is the main class of Huffman JS, the Huffman Tree is capable to
# encode and decode texts based on tree structure. A nice to start is use
# +Huffman.TreeBuilder+ to generate an optimized tree for a given text, but
# this way has the problem that you need to generate a new tree for each text.
# Another approach is create a common tree, save it (you can use encode method,
# that will return to you a simple array representation of tree, them you can
# encode it with json and save as plain text anywhere), and use same tree for
# you encodings
class Huffman.Tree
	# The constructor can receive a node to be the root of tree, if you don't
	# send a root node, a new one will be created for you
	constructor: (@root) ->
		@root ||= new Huffman.Tree.Node
	
	# This method receives a text and encode it using current tree
	encode: (text) ->
		@bitStringToString(@encodeBitString(text))
	
	# This method will receive an encoded string and revert it to original one.
	# Note you need to use same tree that you used to encode when decoding, or
	# this will go really wrong.
	decode: (text) ->
		bitString = @stringToBitString(text)
		decoded = ""
		node = @root
		
		for direction in bitString.split('')
			d = if direction == '0' then 'left' else 'right'
			node = node[d]
			
			if node.isLeaf()
				decoded += node.value
				node = @root
		
		decoded
	
	# This method will receive a text and generate a bit string representation
	# according to tree structure.
	encodeBitString: (text) ->
		encoded = ""
		
		for chr in text.split('')
			encoded += @bitValue(chr)
		
		encoded
	
	# This method will get the Bit String and will encode in raw string,
	# it will also create a _pad_ character to be used when decoding this
	# raw string
	bitStringToString: (bitString) ->
		padByte = 8 - bitString.length % 8
		bitString += "0" for i in [0...padByte]
		
		encoded = for i in [0...bitString.length] by 8
			String.fromCharCode(parseInt(bitString.substr(i, 8), 2)) 
		
		encoded.join('') + padByte.toString()
	
	# This method will revert the process of +bitStringToString+ method.
	stringToBitString: (bitString) ->
		pieces = bitString.split('')
		pad = parseInt(pieces.pop())
		pieces = Huffman.CoreHelpers.lpad(chr.charCodeAt(0).toString(2)) for chr in pieces
		pieces = pieces.join('')
		pieces.substr(0, pieces.length - pad)
	
	# This method will return the bit string representation for a given
	# character
	bitValue: (chr) ->
		@generateLeafCache() unless @leafCache?
		@leafCache[chr]
	
	# This method will create a cache for character representations, when cache
	# is done a bit representation of a character will be retrieved really fast
	generateLeafCache: (node, path) ->
		@leafCache ?= {}
		node ||= @root
		path ||= ""
		
		if node.isLeaf()
			@leafCache[node.value] = path
		else
			@generateLeafCache(node.left, path + "0")
			@generateLeafCache(node.right, path + "1")
	
	# This method will encode current tree as plain javascript array, use it to
	# save your tree for later use (you can get this array and encode it in JSON)
	# format if you want to save it in your database or other storage
	encodeTree: ->
		@root.encode()

# This method will get an array representation of tree (generated with
# +encodeTree+ method) and will build the tree
Huffman.Tree.decodeTree = (data) ->
	new Huffman.Tree(Huffman.Tree.parseNode(data))

# :nodoc:
Huffman.Tree.parseNode = (data) ->
	node = new Huffman.Tree.Node()
	
	if Huffman.CoreHelpers.isArray(data)
		node.left = Huffman.Tree.parseNode(data[0])
		node.right = Huffman.Tree.parseNode(data[1])
	else
		node.value = data
	
	node

# :nodoc:
class Huffman.Tree.Node
	constructor: -> @left = @right = @value = null
	isLeaf: -> @left == @right == null
	
	encode: ->
		if @value
			@value
		else
			[@left.encode(), @right.encode()]
