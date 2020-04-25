const cp = require('child_process')
const fs = require('fs')
const path = require('path')

const { deleteEverythingFromFolder, initializeGitRepository, createDataFiles, } = require('../utils');

const appOpen = () => {
    return new Promise(resolve => {
        cp.exec('git --version', (errorFromCheckingGitVersion, dataFromCheckingGitVersion) => {
            if (errorFromCheckingGitVersion) {
                dl(errorFromCheckingGitVersion)
    
                // fatal error, close the application
                process.exit()
            }
    
            // git exists and is available in the environment variables
            // check if the .data folder exists, if no, create it
    
            const dataFolderPath = path.join(__dirname + '/../.data')
            const gitJournalFolderPath = path.join(dataFolderPath + '/git-journals-data')
    
            if (fs.existsSync(dataFolderPath)) {
                dl('.data folder exists')
    
                // check if the git-journals-data folder exists inside the .data folder, if not create it.
    
                if (fs.existsSync(gitJournalFolderPath)) {
                    dl('git-journals-data folder was found in the .data folder')
                } else {
                    // create the git-journals-data folder inside the .data folder and initialize a git repository inside.
                    // this folder will be the place where all the journal entries will be stored.
    
                    dl('Creating git-journals-data folder inside the .data folder...')
                    fs.mkdirSync(gitJournalFolderPath)
                    dl('git-journals-data folder created.')
                }
    
                // check if there is a git repository initialized inside the git-journals-data folder
                cp.exec(`cd ${gitJournalFolderPath} && git rev-parse --is-inside-work-tree`, (errorFromCheckingIfGitIsInitialized, dataFromCheckingIfGitIsInitialized) => {
                    if (errorFromCheckingIfGitIsInitialized) {
                        dl(errorFromCheckingIfGitIsInitialized)
    
                        // fatal error, close the application
                        process.exit()
                    } else {
                        const isGitRepository = dataFromCheckingIfGitIsInitialized.trim()
                        
                        // if isGitRepository is false, then initialize a git repository inside the git-journals-data folder.
                        // put an additional check to see if git-journals-data folder has a .git folder.
    
                        if (isGitRepository && fs.existsSync(path.join(gitJournalFolderPath + '/.git'))) {
                            dl('git-journals-data is a valid git repository')
                        } else {
                            dl('git-journals-data is not a valid git repository, initializing git repository...')
    
                            // delete everything from the git-journals-data folder
                            deleteEverythingFromFolder(gitJournalFolderPath)
    
                            // initalize git repository inside the git-journals-data folder
                            initializeGitRepository(gitJournalFolderPath)
                        }
    
                        // at this point, .data/git-journals-data should exist and git-journals-data should be a valid git repository.
    
                        // check if all the data files are present inside the git-journals-data folder,
                        // if no, create all the necessary files.
                        dl('Checking if data files are present inside the git-journals-data folder. Will create only if they are not present')
                        createDataFiles(gitJournalFolderPath, true)
                        dl('Checked if data files are present inside the git-journals-data folder. Necesasary actions taken')
                    }

                    // finally, resolve the promise
                    resolve(true)
                })
            } else {
                dl('.data folder does not exist, creating...')
                fs.mkdirSync(dataFolderPath)
                dl('.data folder created.')
                
                // create the git-journals-data folder inside the .data folder and initialize a git repository inside.
                // this folder will be the place where all the journal entries will be stored.
    
                dl('Creating git-journals-data folder inside the .data folder...')
                fs.mkdirSync(gitJournalFolderPath)
                dl('Created git-journals-data folder inside the .data folder')
    
                // initialize git-journals-data as a git repository
                dl('Initializing git-journals-data as a git repository')
                initializeGitRepository(gitJournalFolderPath)
                dl('Initialized git-journals-data as a git repository')
    
                // create all the data files inside the git-journals-data folder.
                dl('Creating the data files')
                createDataFiles(gitJournalFolderPath, false)
                dl('Created the data files')

                // finally, resolve the promise
                resolve(true)
            }
        })
    })
}

module.exports = {
    appOpen,
}