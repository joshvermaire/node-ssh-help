#!/usr/bin/env node

/**
 * Module dependencies.
 */
var fs=require('fs');
var exec = require('child_process').exec;
var sshPath = '~/.ssh/config';
var sshKey = '~/.ssh/id_rsa.pub';
var sshDir = process.cwd().split('/').slice(0,3).join('/');
var program = require('./commander.js');
var log = function(text) {
  if (!program.quiet) console.log(text);
}

program
  .version('0.0.1')
  .option('-C, --no-clipboard', 'disable copy to clipboard')
  .option('-q, --quiet', 'disable output')
  .option('-p, --path [path]', 'Use custom directory path (default ~/.ssh/)', sshDir)

program
 .command('servers')
 .description('Get your ssh server aliases')
 .action(function() {
    var path = program.path + '/.ssh/config'
    var ssh = exec('grep -i "host" ' + path, function(err, stdout, stderr) {
      var servers = stdout.split("\n");
      for (var _i = 0, _len = servers.length - 1 ; _i < _len; _i += 2) {
        var host1 = servers[_i];
        // var host2 = servers[_i + 1];
        log(host1);
      };
    });
 });

 program
 .command('key')
 .description('Get your ssh key and copy to clipboard')
 .action(function() {
    var path = program.path + '/.ssh/id_rsa.pub'
    var key = fs.readFileSync(path,'utf8');
    if (program.clipboard) exec('echo "' + key + '" | pbcopy');
    log(key);
 });

program.parse(process.argv);