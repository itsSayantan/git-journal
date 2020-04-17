const cp = require('child_process')
const fs = require('fs')
const path = require('path')

const { deleteEverythingFromFolder, initializeGitRepository, } = require('../utils');

const appOpen = () => {
    cp.exec('git --version', (errorFromCheckingGitVersion, dataFromCheckingGitVersion) => {
        if (errorFromCheckingGitVersion) {
            dl(errorFromCheckingGitVersion)

            // fatal error, close the application
            process.exit()
        }

        // git exists and is available in the environment variables
        // check if the .data folder exists, if no, create it

        const dataFolderPath = path.join(__dirname + '/../.data')
        const gitNotesFolderPath = path.join(dataFolderPath + '/git-notes-data')

        if (fs.existsSync(dataFolderPath)) {
            dl('.data folder exists')

            // check if the git-notes-data folder exists inside the .data folder, if not create it.

            if (fs.existsSync(gitNotesFolderPath)) {
                dl('git-notes-data folder was found in the .data folder')
            } else {
                // create the git-notes-data folder inside the .data folder and initialize a git repository inside.
                // this folder will be the place where all the notes will be stored.

                dl('Creating git-notes-data folder inside the .data folder...')
                fs.mkdirSync(gitNotesFolderPath)
                dl('git-notes-data folder created.')
            }

            // check if there is a git repository initialized inside the git-notes-data folder
            cp.exec(`cd ${gitNotesFolderPath} && git rev-parse --is-inside-work-tree`, (errorFromCheckingIfGitIsInitialized, dataFromCheckingIfGitIsInitialized) => {
                if (errorFromCheckingIfGitIsInitialized) {
                    dl(errorFromCheckingIfGitIsInitialized)

                    // fatal error, close the application
                    process.exit()
                } else {
                    const isGitRepository = dataFromCheckingIfGitIsInitialized.trim()
                    
                    // if isGitRepository is false, then initialize a git repository inside the git-notes-data folder.
                    // put an additional check to see if git-notes-data folder has a .git folder.

                    if (isGitRepository && fs.existsSync(path.join(gitNotesFolderPath + '/.git'))) {
                        dl('git-notes-data is a valid git repository')
                    } else {
                        dl('git-notes-data is not a valid git repository, initializing git repository...')

                        // delete everything from the git-notes-data folder
                        deleteEverythingFromFolder(gitNotesFolderPath)

                        // initalize git repository inside the git-notes-data folder
                        initializeGitRepository(gitNotesFolderPath)
                    }

                    // at this point, .data/git-notes-data should exist and git-notes-data should be a valid git repository.

                    // @TODO check if all the data files are present inside the git-notes-data folder,
                    // if no, create all the necessary files.
                }
            })
        } else {
            dl('.data folder does not exist, creating...')
            fs.mkdirSync(dataFolderPath)
            dl('.data folder created.')
            
            // create the git-notes-data folder inside the .data folder and initialize a git repository inside.
            // this folder will be the place where all the notes will be stored.

            dl('Creating git-notes-data folder inside the .data folder...')
            fs.mkdirSync(gitNotesFolderPath)
            dl('git-notes-data folder created.')

            // initialize git-notes-data as a git repository
            dl('Initializing git-notes-data as a git repository')
            initializeGitRepository(gitNotesFolderPath)
        }
    })
}

module.exports = {
    appOpen,
}