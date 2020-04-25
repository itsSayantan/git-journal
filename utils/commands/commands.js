const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const {
    commandsList,
} = require('../../constants')

/**
 * 
 * @param {Array<string>} commandArgumentsList list of arguments for the 'create' command 
 */
const executeCreate = (commandArgumentsList=[]) => {
    const {
        performJournalCommit,
    } = require('../')
    
    return new Promise((resolve, reject) => {
        const showCreateJournalPrompt = () => {
            rl.question("Write a journal: ", function(journal) {
                dl(`Journal input: ${journal}`)

                // trim all leading and trailing white spaces from journal
                journal = journal.trim()

                // check if the journal is empty, if so, notify the user and reset the prompt
                if (typeof journal === 'string' && journal.length === 0) {
                    console.log(`Invalid journal. Please enter a non-empty journal and try again.`)

                    showCreateJournalPrompt()
                } else {
                    // this process might change in the future versions
                    // check if the journals.json file exists
                    dl(`Creating journal...`)
                    const journalsFolderPath = path.join(__dirname, '/../../.data/git-journals-data')
                    const journalsFilePath = path.join(journalsFolderPath, '/journals.json')

                    dl(`Checking if journals.json is present...`)
                    if (fs.existsSync(journalsFilePath)) {
                        dl(`journals.json was found`)
                        // store the journal in the git-journals-data data file(s)

                        dl(`Reading content of journals.json`)
                        const journalsFileContent = fs.readFileSync(journalsFilePath, 'utf-8')
                        dl(`journals.json content read`)

                        // check if the content is a valid json

                        try {
                            // if journals file content is empty, consider string {}, else the journalsFileContent
                            let parsedJson = JSON.parse((journalsFileContent.trim().length === 0) ? '{}' : journalsFileContent)

                            // insert the journal into this parsed json
                            const currentTimestamp = Date.now()
                            parsedJson[currentTimestamp.toString()] = journal

                            dl(`Content to be saved: ${JSON.stringify(parsedJson)}`)

                            // save the latest content to the journals.json file
                            fs.writeFileSync(journalsFilePath, JSON.stringify(parsedJson, null, 4))

                            // perform a git add and commit on the git-journals-data folder
                            performJournalCommit(journalsFolderPath, `1. Journal ${currentTimestamp} created.`)

                            resolve(`Journal created on ${(new Date(currentTimestamp))}. Journal ID: ${currentTimestamp}`)
                        } catch(jsonParseError) {
                            reject(jsonParseError)
                        }
                    } else {
                        dl(`journals.json was not found`)
                        reject('journals.json file is not found.')
                    }
                }
            });
        }

        // call the showCreateJournalPrompt method
        showCreateJournalPrompt()
    })
}

/**
 * 
 * @param {Array<string>} commandArgumentsList list of arguments for the 'getall' command 
 */
const executeGetAll = (commandArgumentsList=[]) => {
    return new Promise((resolve, reject) => {
        // check if the journals file exist        
        const journalsFolderPath = path.join(__dirname, '/../../.data/git-journals-data')
        const journalsFilePath = path.join(journalsFolderPath, '/journals.json')

        dl(`Checking if journals.json exist`)
        if (fs.existsSync(journalsFilePath)) {
            dl(`journals.json was found`)

            // read the data and return a string

            dl(`Reading content of journals.json`)
            const journalsFileContent = fs.readFileSync(journalsFilePath, 'utf-8')
            dl(`journals.json content read`)

            if (journalsFileContent.trim().length === 0) {
                dl(`journals.json is empty`)
                resolve(`No journals found. Start by creating a journal with the 'create' command.`)
            } else {
                dl('journals.json is not empty')

                // check if the journalFileContent is a valid JSON

                try {
                    let parsedJson = JSON.parse(journalsFileContent)

                    // check if there are any journals in parsedJson
                    const keys = Object.keys(parsedJson)
                    const l = keys.length

                    if (l === 0) {
                        resolve(`No journals found. Start by creating a journal with the 'create' command.`)
                    }

                    /**
                     * else, return a string in the following format:
                     * Journal ID: journal_id)
                     * [created on: <date_of_creation>]
                     * <journal_text>
                     */

                    let outputString = `\nList of all journals:\n=====================\n\n`

                    for (let i = 0; i < l; ++i) {
                        const ki = keys[i]

                        outputString += `Journal ID: ${ki}\n[created on: ${(new Date(Number(ki)))}]\n${parsedJson[ki]}\n\n`
                    }

                    resolve(outputString)
                } catch(jsonParseError) {
                    reject(jsonParseError)
                }
            }
        } else {
            dl(`journals.json was not found`)
            reject('journals.json file is not found.')
        }
    })
}

/**
 * 
 * @param {Array<string>} commandArgumentsList list of arguments for the 'get' command 
 */
const executeGet = (commandArgumentsList=[]) => {
    return new Promise((resolve, reject) => {
        // check if the journalID was sent as a command line argument

        if (commandArgumentsList instanceof Array && typeof commandArgumentsList[0] === 'string') {
            const journalID = commandArgumentsList[0]

            // check if the journals file exist        
            const journalsFolderPath = path.join(__dirname, '/../../.data/git-journals-data')
            const journalsFilePath = path.join(journalsFolderPath, '/journals.json')

            dl(`Checking if journals.json exist`)
            if (fs.existsSync(journalsFilePath)) {
                dl(`journals.json was found`)

                // read the data and return a string

                dl(`Reading content of journals.json`)
                const journalsFileContent = fs.readFileSync(journalsFilePath, 'utf-8')
                dl(`journals.json content read`)

                if (journalsFileContent.trim().length === 0) {
                    dl(`journals.json is empty`)
                    resolve(`No journals found. Start by creating a journal with the 'create' command.`)
                } else {
                    dl('journals.json is not empty')

                    // check if the journalFileContent is a valid JSON

                    try {
                        let parsedJson = JSON.parse(journalsFileContent)

                        // check if there are any journals in parsedJson
                        const keys = Object.keys(parsedJson)
                        const l = keys.length

                        if (l === 0) {
                            resolve(`No journals found. Start by creating a journal with the 'create' command.`)
                        }

                        /**
                         * else, find the journal corresponding to
                         * the journal ID sent and then return a string
                         * in the following format:
                         * Journal ID: journal_id)
                         * [created on: <date_of_creation>]
                         * <journal_text>
                         */

                        const journal = parsedJson[journalID]

                        if (typeof journal === 'string') {
                            // journal exists
                            let outputString = '\nResult:\n=======\n\n'

                            outputString += `Journal ID: ${journalID}\n[created on: ${(new Date(Number(journalID)))}]\n${journal}\n\n`
                            resolve(outputString)
                        } else {
                            // journal does not exist
                            resolve(`Journal with ID: ${journalID} not found.`)
                        }
                    } catch(jsonParseError) {
                        reject(jsonParseError)
                    }
                }
            } else {
                dl(`journals.json was not found`)
                reject('journals.json file is not found.')
            }
        } else {
            dl(`invalid argument(s) sent to the 'get' command`)
            reject(`Improper journal ID sent: ${commadArgumentsList[0]}.`)
        }
    })
}

/**
 * 
 * @param {Array<string>} commandArgumentsList list of arguments for the 'help' command 
 */
const executeHelp = (commadArgumentsList=[]) => {
    return new Promise((resolve) => {
        // clear the screen if not in debug mode
        if (process.env.NODE_DEBUG !== 'git-journal') {
            console.clear()
        }

        /**
         * read the commandsList constant and return a string in the following format:
         * - <command_name>
         *      + <argument> - <description_of_the_argument>
         */

        let outputString = '\nList of all commands:\n=====================\n'

        const keys = Object.keys(commandsList)
        const l = keys.length

        for (let i = 0; i < l; ++i) {
            const ki = keys[i]
            const cki = commandsList[ki]

            outputString += `\n- ${ki}\n`

            const ckiv = cki.commandArgumentsList

            if (ckiv) {
                const ckivtKeys = Object.keys(ckiv)
                const l2 = ckivtKeys.length

                for (let j = 0; j < l2; ++j) {
                    const ckivtKey = ckivtKeys[j];
                    
                    outputString += `\n\t+ ${ckivtKey} - ${ckiv[ckivtKey]}\n`
                }
            }
        }

        resolve(outputString)
    })
}

/**
 * 
 * @param {Array<string>} commandArgumentsList list of arguments for the 'exit' command 
 */
const executeExit = (commandArgumentsList=[]) => {
    // close the readline
    rl.close()
}

module.exports = {
    executeCreate,
    executeGetAll,
    executeGet,
    executeHelp,
    executeExit,
}