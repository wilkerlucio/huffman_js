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

asyncLoop = require("./core_helpers").asyncLoop
isArray = require("./core_helpers").isArray
lpad = require("./core_helpers").lpad

# Huffman Tree is the main class of Huffman JS, the Huffman Tree is capable to
# encode and decode texts based on tree structure. A nice to start is use
# +Huffman.TreeBuilder+ to generate an optimized tree for a given text, but
# this way has the problem that you need to generate a new tree for each text.
# Another approach is create a common tree, save it (you can use encode method,
# that will return to you a simple array representation of tree, them you can
# encode it with json and save as plain text anywhere), and use same tree for
# you encodings
class Tree
	# The constructor can receive a node to be the root of tree, if you don't
	# send a root node, a new one will be created for you
	constructor: (@root) ->
		@root ||= new Node()
	
	# This method receives a text and encode it using current tree
	encode: (text, callback) ->
		@encodeBitString text, (bitString) =>
			@bitStringToString bitString, (encoded) ->
				callback(encoded)
	
	# This method will receive an encoded string and revert it to original one.
	# Note you need to use same tree that you used to encode when decoding, or
	# this will go really wrong.
	decode: (text, callback) ->
		@stringToBitString text, (bitString) =>
			decoded = ""
			node = @root
			i = 0
			
			asyncLoop (next) =>
				if i < bitString.length
					d = if bitString.charAt(i) == '0' then 'left' else 'right'
					node = node[d]
					
					if node.isLeaf()
						decoded += node.value
						node = @root
					
					i++
					next()
				else
					callback(decoded)
	
	# This method will receive a text and generate a bit string representation
	# according to tree structure.
	encodeBitString: (text, callback) ->
		encoded = ""
		i = 0
		
		asyncLoop (next) =>
			if i < text.length
				encoded += @bitValue(text.charAt(i))
				i++
				next()
			else
				callback(encoded)
	
	# This method will get the Bit String and will encode in raw string,
	# it will also create a _pad_ character to be used when decoding this
	# raw string
	bitStringToString: (bitString, callback) ->
		padByte = 8 - bitString.length % 8
		bitString += "0" for i in [0...padByte]
		i = 0
		encoded = ""
		
		asyncLoop (next) ->
			if i < bitString.length
				encoded += String.fromCharCode(parseInt(bitString.substr(i, 8), 2))
				i += 8
				next()
			else
				encoded += padByte.toString()
				callback(encoded)
	
	# This method will revert the process of +bitStringToString+ method.
	stringToBitString: (bitString, callback) ->
		pieces = bitString.split('')
		pad = parseInt(pieces.pop())
		i = 0
		
		asyncLoop (next) ->
			if i < pieces.length
				chr = pieces[i]
				pieces[i] = lpad(chr.charCodeAt(0).toString(2))
				i++
				next()
			else
				pieces = pieces.join('')
				pieces = pieces.substr(0, pieces.length - pad)
				callback(pieces)
	
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
	encodeTree: (callback) ->
		@root.encode(callback)

# This method will get an array representation of tree (generated with
# +encodeTree+ method) and will build the tree
Tree.decodeTree = (data, callback) ->
	Tree.parseNode data, (root) ->
		callback(new Tree(root))

# :nodoc:
Tree.parseNode = (data, callback) ->
	node = new Node()
	
	if isArray(data)
		process.nextTick ->
			Tree.parseNode data[0], (n1) ->
				Tree.parseNode data[1], (n2) ->
					node.left = n1
					node.right = n2
					callback(node)
	else
		node.value = data
		callback(node)

# :nodoc:
class Node
	constructor: -> @left = @right = @value = null
	isLeaf: -> @left == @right == null
	
	encode: (callback) ->
		if @value
			callback(@value)
		else
			process.nextTick =>
				@left.encode (l) =>
					@right.encode (r) ->
						callback([l, r])

module.exports = Tree
