const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const {
    commandArgumentsList, commandsList,
} = require('../../constants')

/**
 * 
 * @param {Array<string>} commandArgumentsList list of arguments for the 'create' command 
 */
const executeCreate = (commandArgumentsList=[]) => {
    return new Promise((resolve, reject) => {
        const showCreateNotePrompt = () => {
            rl.question("Write a note: ", function(note) {
                dl(`Note input: ${note}`)

                // trim all leading and trailing white spaces from note
                note = note.trim()

                // check if the note is empty, if so, notify the user and reset the prompt
                if (typeof note === 'string' && note.length === 0) {
                    console.log(`Invalid note. Please enter a non-empty note and try again.`)

                    showCreateNotePrompt()
                } else {
                    // this process might change in the future versions
                    // check if the notes.json file exists
                    dl(`Creating note...`)
                    const notesFolderPath = path.join(__dirname, '/../../.data/git-notes-data')
                    const notesFilePath = path.join(notesFolderPath, '/notes.json')

                    dl(`Checking if notes.json is present...`)
                    if (fs.existsSync(notesFilePath)) {
                        dl(`notes.json was found`)
                        // store the note in the git-notes-data data file(s)

                        dl(`Reading content of notes.json`)
                        const notesFileContent = fs.readFileSync(notesFilePath, 'utf-8')
                        dl(`notes.json content read`)

                        // check if the content is a valid json

                        try {
                            // if notes file content is empty, consider string {}, else the notesFileContent
                            let parsedJson = JSON.parse((notesFileContent.trim().length === 0) ? '{}' : notesFileContent)

                            // insert the note into this parsed json
                            const currentTimestamp = Date.now()
                            parsedJson[currentTimestamp.toString()] = note

                            dl(`Content to be saved: ${JSON.stringify(parsedJson)}`)

                            // save the latest content to the notes.json file
                            fs.writeFileSync(notesFilePath, JSON.stringify(parsedJson, null, 4))

                            // perform a git add and commit on the git-notes-data folder
                            cp.execSync(`cd ${notesFolderPath} && git add . && git commit -m "1. Note ${currentTimestamp} created."`)

                            resolve(`Note created on ${(new Date(currentTimestamp))}. Note ID: ${currentTimestamp}`)
                        } catch(jsonParseError) {
                            reject(jsonParseError)
                        }
                    } else {
                        dl(`notes.json was not found`)
                        reject('notes.json file is not found.')
                    }
                }
            });
        }

        // call the showCreateNotePrompt method
        showCreateNotePrompt()
    })
}

/**
 * 
 * @param {Array<string>} commandArgumentsList list of arguments for the 'getall' command 
 */
const executeGetAll = (commandArgumentsList=[]) => {
    return new Promise((resolve, reject) => {
        // check if the notes file exist        
        const notesFolderPath = path.join(__dirname, '/../../.data/git-notes-data')
        const notesFilePath = path.join(notesFolderPath, '/notes.json')

        dl(`Checking if notes.json exist`)
        if (fs.existsSync(notesFilePath)) {
            dl(`notes.json was found`)

            // read the data and return a string

            dl(`Reading content of notes.json`)
            const notesFileContent = fs.readFileSync(notesFilePath, 'utf-8')
            dl(`notes.json content read`)

            if (notesFileContent.trim().length === 0) {
                dl(`notes.json is empty`)
                resolve(`No notes found. Start by creating a note with the 'create' command.`)
            } else {
                dl('notes.json is not empty')

                // check if the noteFileContent is a valid JSON

                try {
                    let parsedJson = JSON.parse(notesFileContent)

                    // check if there are any notes in parsedJson
                    const keys = Object.keys(parsedJson)
                    const l = keys.length

                    if (l === 0) {
                        resolve(`No notes found. Start by creating a note with the 'create' command.`)
                    }

                    /**
                     * else, return a string in the following format:
                     * Note ID: note_id)
                     * [created on: <date_of_creation>]
                     * <note_text>
                     */

                    let outputString = `\nList of all notes:\n==================\n\n`

                    for (let i = 0; i < l; ++i) {
                        const ki = keys[i]

                        outputString += `note ID: ${ki}\n[created on: ${(new Date(Number(ki)))}]\n${parsedJson[ki]}\n\n`
                    }

                    resolve(outputString)
                } catch(jsonParseError) {
                    reject(jsonParseError)
                }
            }
        } else {
            dl(`notes.json was not found`)
            reject('notes.json file is not found.')
        }
    })
}

/**
 * 
 * @param {Array<string>} commandArgumentsList list of arguments for the 'get' command 
 */
const executeGet = (commandArgumentsList=[]) => {
    return new Promise((resolve, reject) => {
        // check if the noteID was sent as a command line argument

        if (commandArgumentsList instanceof Array && typeof commandArgumentsList[0] === 'string') {
            const noteID = commandArgumentsList[0]

            // check if the notes file exist        
            const notesFolderPath = path.join(__dirname, '/../../.data/git-notes-data')
            const notesFilePath = path.join(notesFolderPath, '/notes.json')

            dl(`Checking if notes.json exist`)
            if (fs.existsSync(notesFilePath)) {
                dl(`notes.json was found`)

                // read the data and return a string

                dl(`Reading content of notes.json`)
                const notesFileContent = fs.readFileSync(notesFilePath, 'utf-8')
                dl(`notes.json content read`)

                if (notesFileContent.trim().length === 0) {
                    dl(`notes.json is empty`)
                    resolve(`No notes found. Start by creating a note with the 'create' command.`)
                } else {
                    dl('notes.json is not empty')

                    // check if the noteFileContent is a valid JSON

                    try {
                        let parsedJson = JSON.parse(notesFileContent)

                        // check if there are any notes in parsedJson
                        const keys = Object.keys(parsedJson)
                        const l = keys.length

                        if (l === 0) {
                            resolve(`No notes found. Start by creating a note with the 'create' command.`)
                        }

                        /**
                         * else, find the note corresponding to
                         * the note ID sent and then return a string
                         * in the following format:
                         * Note ID: note_id)
                         * [created on: <date_of_creation>]
                         * <note_text>
                         */

                        const note = parsedJson[noteID]

                        if (typeof note === 'string') {
                            // note exists
                            let outputString = '\nResult:\n=======\n\n'

                            outputString += `note ID: ${noteID}\n[created on: ${(new Date(Number(noteID)))}]\n${note}\n\n`
                            resolve(outputString)
                        } else {
                            // note does not exist
                            resolve(`Note with ID: ${noteID} not found.`)
                        }
                    } catch(jsonParseError) {
                        reject(jsonParseError)
                    }
                }
            } else {
                dl(`notes.json was not found`)
                reject('notes.json file is not found.')
            }
        } else {
            dl(`invalid argument(s) sent to the 'get' command`)
            reject(`Improper note ID sent: ${commadArgumentsList[0]}.`)
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
        if (process.env.NODE_DEBUG !== 'git-notes') {
            console.clear()
        }

        /**
         * read the commandsList constant and return a string in the following format:
         * - <command_name>
         *      + <argument> - <description_of_the_argment>
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