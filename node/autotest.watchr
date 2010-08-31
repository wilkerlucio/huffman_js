def run_all_tests
  print `clear`
  puts "Tests run #{Time.now.strftime('%Y-%m-%d %H:%M:%S')}"
  puts `node ./runner.js`
end

run_all_tests
watch("(test|lib)(/.*)+.js") { |m| run_all_tests }

@interrupted = false

# Ctrl-C
Signal.trap "INT" do
  if @interrupted
    abort("\n")
  else
    puts "Interrupt a second time to quit"
    @interrupted = true
    Kernel.sleep 1.5

    run_all_tests
    @interrupted = false
  end
end
