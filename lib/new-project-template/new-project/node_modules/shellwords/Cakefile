{spawn, exec} = require "child_process"
watch   = require "nodewatch"

task "spec", "Runs the Jasmine specs.", ->
  header()

  jasmine = spawn "node", ["node_modules/jasmine-node/lib/jasmine-node/cli.js", "--coffee", "-i", "src", "spec"]

  jasmine.stdout.on "data", (data) ->
    process.stdout.write data
  jasmine.stderr.on "data", (data) ->
    process.stderr.write data

  jasmine.stdin.end()

task "watch", "Watches for file changes, recompiling CoffeeScript and running the Jasmine specs.", ->
  console.log "Watching Shellwords for changes...\n"

  invoke "spec"

  watch.add("src").add("spec").onChange (file, prev, cur) ->
    exec "coffee -co lib src", (error, stdout, stderr) ->
      throw error if error

    invoke "spec"

header = ->
  divider = "------------"
  console.log divider, dateString(), divider

dateString = ->
  d = new Date
  h = d.getHours()
  m = d.getMinutes()
  s = d.getSeconds()
  meridiem = if h >= 12 then "PM" else "AM"
  h -= 12 if h > 12
  h = 12 if h is 0
  m = "0" + m if m < 10
  s = "0" + s if s < 10

  "#{d.toLocaleDateString()} #{h}:#{m}:#{s} #{meridiem}"
