const cp = require('child_process')

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
    cp.exec(`cd ${folderPath} && git init`, (errorFromCreatingGitRepository, dataFromCreatingGitRepository) => {
        if (errorFromCreatingGitRepository) {
            dl(errorFromCreatingGitRepository)

            // fatal error, close the application
            process.exit()
        } else {
            dl(dataFromCreatingGitRepository)
        }
    })
}

module.exports = {
    deleteEverythingFromFolder,
    initializeGitRepository,
}