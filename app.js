#!/usr/bin/env node

const util = require('util')
const readline = require("readline");

const { appOpen } = require('./flow/app-open')
const { welcome } = require('./flow/welcome')

const { parseRawCommand, executeCommand, showCommandResponse, } = require('./utils')

const dl = util.debuglog('git-journal')
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

        // set the rl to global as it will be used by other modules
        global.rl = rl

        const showAppCommandPrompt = () => {
            rl.question("Enter a command: ", async function(rawCommand) {
                // parse the command
                const parsedCommand = parseRawCommand(rawCommand)

                // execute the parsed command
                try {
                    const commandResponse = await executeCommand(parsedCommand)

                    dl(`executeCommand successful with response: ${JSON.stringify(commandResponse)}`)
                    
                    // show command response only when status is true, message exists and is a string and has a length > 0
                    if (commandResponse.status === true && typeof commandResponse.message === 'string' && commandResponse.message.trim().length > 0) {
                        showCommandResponse(commandResponse)
                    }
                } catch(errorFromExecuteCommand) {
                    dl(`executeCommand error: ${JSON.stringify(errorFromExecuteCommand)}`)
                    showCommandResponse(errorFromExecuteCommand)
                }

                showAppCommandPrompt()
            });
        }

        // initiate the app command prompt
        showAppCommandPrompt()

        rl.on("close", function() {
            console.log("\nExiting git-journal. Mischief managed !!");
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