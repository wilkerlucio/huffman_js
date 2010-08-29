# encoding: utf-8

require 'rubygems'
require 'bundler'

Bundler.setup
Bundler.require

def current_version
  File.read("VERSION")
end

desc "Compile CoffeeScripts and watch for changes"
task :coffee do
  coffee = IO.popen 'coffee -wc --no-wrap -o lib src/*.coffee 2>&1'
  
  while line = coffee.gets
    puts line
  end
end

desc "Build minified version"
task :build do
  compressor = YUI::JavaScriptCompressor.new(:munge => true)
  
  modules = ["huffman", "core_helpers", "tree", "tree_builder"]
  
  content = modules.inject("") { |c, mod| c + File.read("lib/#{mod}.js") }
  minyfied = compressor.compress(content)
  version = current_version
  
  licence = <<LIC
/**
 * Copyright (c) 2010 Wilker Lúcio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
LIC
  
  dist_path = "dist/huffman-#{version}.min.js"
  
  File.open(dist_path, "wb") do |f|
    f << licence
    f << minyfied
  end
  
  puts "Built version #{version} at #{dist_path}"
end
