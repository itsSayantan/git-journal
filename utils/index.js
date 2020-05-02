const cp = require('child_process')
const fs = require('fs')

const { commandMap } = require('./commands')

/**
 * 
 * @param {string} folderPath folder inside which everything will be deleted
 */
const deleteEverythingFromFolder = (folderPath) => {
    dl(`Deleting everything from ${folderPath}`)
    cp.exec(`rm -rf ${folderPath}/**`, (errorFromDeletingEverythingFromFolder, dataFromDeletingEverythingFromFolder) => {
        if (errorFromDeletingEverythingFromFolder) {
            dl(errorFromDeletingEverythingFromFolder)

            // fatal error, close the application
            process.exit()
        }
    })
}

/**
 * 
 * @param {string} folderPath folder which needs to be initialized as a git repository
 */
const initializeGitRepository = (folderPath) => {
    cp.execSync(`cd ${folderPath} && git init`)
}

/**
 * 
 * @param {string} folderPath path to the folder where the data files need to be created
 * @param {boolean} dontCreateIfExists if, true, the data files wont be created if they are already present
 */
const createDataFiles = (folderPath, dontCreateIfExists = false) => {
    const dataFilesList = ['journals.json']

    const l = dataFilesList.length

    for (let i = 0; i < l; ++i) {
        const dataFile = dataFilesList[i];

        if (dontCreateIfExists) {
            if (fs.existsSync(folderPath + '/' + dataFile))
                continue
        }
        
        fs.writeFileSync(folderPath + '/' + dataFile, '')
    }

    // create an initial commit
    performJournalCommit(folderPath, `1. git-journal initialized: ${Date.now()}`, true)
}

/**
 * 
 * @param {string} rawCommandString raw command string to be parsed
 */
const parseRawCommand = (rawCommandString='') => {
    // trim all the leading and trailing white spaces from the raw command string

    dl(`Raw command string: ${rawCommandString}`)
    const trimmedCommandString = rawCommandString.trim()

    dl(`Trimmed raw command string: ${trimmedCommandString}`)

    if (trimmedCommandString.length === 0) {
        dl(`The trimmed command was empty`)
        return {
            mainCommand: null,
            commandArguments: []
        }
    } else {
        const parsedCommandArray = trimmedCommandString.split(' ')
        const [, ...rest] = parsedCommandArray
        dl(`Parsed command array: ${parsedCommandArray}`)

        return {
            mainCommand: parsedCommandArray[0],
            commandArguments: rest
        }
    }
}

/**
 * 
 * @param {{mainCommand: string, commandArguments: Array<string>}} parsedCommand parsed command object, result of parseRawCommad(rawCommandString)
 */
const executeCommand = (parsedCommand) => {
    return new Promise(async (resolve, reject) => {
        // check if the parsedCommand argument has a 'mainCommand' key
        const mainCommand = parsedCommand.mainCommand
        if (typeof mainCommand === 'string') {
            // check if mainCommand exists in the command map
            const commandMapEntry = commandMap[mainCommand]
            if (commandMapEntry) {
                // execute the command callback in commandMapEntry

                try {
                    const commandResponse = await commandMapEntry.execute(parsedCommand.commandArguments)

                    resolve({
                        status: true,
                        message: commandResponse,
                    })
                } catch(errorFromCommandCallback) {
                    reject({
                        status: false,
                        commandError: errorFromCommandCallback,
                        message: `Command ${mainCommand} failed.`
                    })
                }

            } else {
                reject({
                    status: false,
                    message: 'Command does not exist.'
                })
            }
        } else {
            reject({
                status: false,
                message: 'Invalid command input.'
            })
        }
    })
}

/**
 * 
 * @param {{status: boolean, message: string}} commandResponse command response received as a result of executeCommand(parsedCommad)
 */
const showCommandResponse = (commandResponse) => {
    if (commandResponse.status === false && commandResponse.commandError) {
        console.log(`Commnad Error: ${commandResponse.commandError}`)
    }
    console.log(commandResponse.message)
}

/**
 * 
 * @param {string} journalsFolderPath path to the folder containing journals.json
 * @param {string} commitMessage message to be used while commiting
 * @param {boolean} allowEmpty if true, empty commit with be allowed
 */
const performJournalCommit = (journalsFolderPath, commitMessage, allowEmpty=false) => {
    const allowEmptyString = allowEmpty ? '--allow-empty' : ''
    cp.execSync(`cd ${journalsFolderPath} && git add . && git commit ${allowEmptyString} -m "${commitMessage}"`)
}

/**
 * 
 * @param {string} confirmationPromptText message to show in the confirmation prompt
 * @param {Array<string>} validOptions array of strings that are valid options (should not have leading or trailing spaces)
 */
const userConfirmationPrompt = (confirmationPromptText, validOptions) => {
    return new Promise(resolve => {
        rl.question(confirmationPromptText, data => {
            // considering all the strings in validOptions array will not have leading or trailing spaces
            const enteredOption = data.trim()
            dl(`Entered Option: ${enteredOption}`)
    
            if (validOptions.indexOf(enteredOption) !== -1) {
                resolve(enteredOption)
            } else {
                console.log(`Invalid Option: ${enteredOption}. Please try again.`)
                userConfirmationPrompt(confirmationPromptText, validOptions)
            }
        })
    })
}

/**
 * 
 * @param {string} journalsFolderPath path to the folder containing journals.json
 */
const gitRemoteRemoveOrigin = (journalsFolderPath) => {
    const removeOriginCommand = `cd ${journalsFolderPath} && git remote rm origin`
    
    try {
        cp.execSync(removeOriginCommand)
    } catch(error) {
        dl(`Error from git remote rm command: ${JSON.stringify(error)}`)
    }
}

/**
 * 
 * @param {string} journalsFolderPath path to the folder containing journals.json
 * @param {string} gitRemoteUrl remote url of the git repository where the jounals need to be pushed
 */
const gitRemoteAddOrigin = (journalsFolderPath, gitRemoteUrl) => {
    const addOriginCommand = `cd ${journalsFolderPath} && git remote add origin ${gitRemoteUrl}`
    
    cp.execSync(addOriginCommand)
}

/**
 * 
 * @param {string} journalsFolderPath path to the folder containing journals.json
 */
const gitPull = (journalsFolderPath) => {
    const pullCommand = `cd ${journalsFolderPath} && git pull origin master --allow-unrelated-histories`

    // release the readline 'rl' being used by git-jounral so that user can enter the user id and password if a prompt is shown by git
    rl.pause()
    process.stdin.setRawMode(false)
    
    cp.execSync(pullCommand)
    
    // resume the released readline 'rl'
    rl.resume()
}

/**
 * 
 * @param {string} journalsFolderPath path to the folder containing journals.json
 */
const gitPush = (journalsFolderPath) => {
    const pushCommand = `cd ${journalsFolderPath} && git push origin master`

    // release the readline 'rl' being used by git-jounral so that user can enter the user id and password if a prompt is shown by git
    rl.pause()
    process.stdin.setRawMode(false)

    cp.execSync(pushCommand)
    
    // resume the released readline 'rl'
    rl.resume()
}

/**
 * 
 * @param {string} journalsFolderPath path to the folder containing journals.json
 * @param {boolean} pop if true, git stash pop will be done
 */
const gitStash = (journalsFolderPath, pop=false) => {
    const popText = pop ? 'pop' : ''
    const gitStashCommand = `cd ${journalsFolderPath} && git stash ${popText}`

    try {
        cp.execSync(gitStashCommand)
    } catch(error) {
        dl(`Error from git stash ${popText} command: ${error}`)
    }
}

module.exports = {
    deleteEverythingFromFolder,
    initializeGitRepository,
    createDataFiles,
    parseRawCommand,
    executeCommand,
    showCommandResponse,
    performJournalCommit,
    userConfirmationPrompt,
    gitRemoteRemoveOrigin,
    gitRemoteAddOrigin,
    gitPull,
    gitPush,
    gitStash,
}