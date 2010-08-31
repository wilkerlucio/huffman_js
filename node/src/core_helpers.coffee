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

module.exports = {
	# Check a given object is an array
	isArray: (obj) ->
		!!(obj && obj.constructor == Array)
	
	# Pad a string, used to pad bits into a full byte
	lpad: (string, length) ->
		length ||= 8
		
		while string.length < length
			string = "0" + string
		
		string
	
	asyncLoop: (fn) ->
		n = null
		fnBound = () -> fn(n)
		n = -> process.nextTick(fnBound)
		fnBound()
}
