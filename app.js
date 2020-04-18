#!/usr/bin/env node

const util = require('util')
const readline = require("readline");

const { appOpen } = require('./flow/app-open')
const { welcome } = require('./flow/welcome')

const { parseRawCommand } = require('./utils')

const dl = util.debuglog('git-notes')
global.dl = dl

// main function to initialize the application
const init = async () => {
    // inititate the app-open flow
    const responseFromAppOpenFlow = await appOpen()

    if (responseFromAppOpenFlow === true) {
        // intitate the welcome flow
        welcome()

        // give a gap
        console.log('\n'.repeat(1))

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const showAppCommandPrompt = () => {
            rl.question("Enter a command: ", function(rawCommand) {
                console.log(rawCommand)

                // parse the command
                console.log(parseRawCommand(rawCommand))


                showAppCommandPrompt()
            });
        }

        // initiate the app command prompt
        showAppCommandPrompt()

        rl.on("close", function() {
            console.log("\nExiting git-notes. Mischief managed !!");
            process.exit();
        });
    } else {
        // something went wrong in the app open flow
        dl('app-open flow failed')
        process.exit()
    }
}

// call the init method
init()