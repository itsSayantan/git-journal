const fs = require('fs')
const path = require('path')
const cp = require('child_process')

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

module.exports = {
    executeCreate,
}