#!/usr/bin/env node

const util = require('util')
const readline = require("readline");

const { appOpen } = require('./flow/app-open')
const { welcome } = require('./flow/welcome')

const dl = util.debuglog('git-notes')
global.dl = dl

// inititate the app-open flow
appOpen()

// intitate the welcome flow
welcome()

// show the prompt
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter a command:", function(rawCommand) {
    console.log(rawCommand)

    // @TODO parse the command
});

rl.on("close", function() {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});