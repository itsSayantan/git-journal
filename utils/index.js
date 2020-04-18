const cp = require('child_process')
const fs = require('fs')

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
    const dataFilesList = ['notes.json']

    const l = dataFilesList.length

    for (let i = 0; i < l; ++i) {
        const dataFile = dataFilesList[i];

        if (dontCreateIfExists) {
            if (fs.existsSync(folderPath + '/' + dataFile))
                continue
        }
        
        fs.writeFileSync(folderPath + '/' + dataFile, '')
    }
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

module.exports = {
    deleteEverythingFromFolder,
    initializeGitRepository,
    createDataFiles,
    parseRawCommand,
}