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

module.exports = {
    deleteEverythingFromFolder,
    initializeGitRepository,
    createDataFiles,
}