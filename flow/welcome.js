const fs = require('fs')
const path = require('path')

const welcomeMessage = `*****************************
        GIT - JOURNAL
*****************************`

// dynamically find out the project version from the package.json file
const projectVersion = JSON.parse(fs.readFileSync(path.join(__dirname + '/../package.json'))).version

const projectInformation = `\nVersion: ${projectVersion}\n\nProject URL: https://github.com/itsSayantan/git-journal`

const authorInformation = `\nAuthor: Sayantan Ghosh\nWebiste: https://sayantan-ghosh.herokuapp.com\nGithub Profile: https://github.com/itsSayantan`

const helpInformation = `\nEnter command: 'help' to get the list of commands or enter 'exit' to exit the application.\n\nNote:\n\nPlease restore all your journals in case you updated the repository where you have backed up your journals or you are about to use a remote repository which has its own set of commits that might cause a conflict here. If you change your local journals repository before restoring the journals from your remote repository, you might face conflicts while making a backup, which can only be resolved by you.`

const welcome = () => {
    // show the welcome message, only if the application is not being run in the debug mode
    if (process.env.NODE_DEBUG !== 'git-journal')
        console.clear()

    console.log(welcomeMessage)

    // show the project information
    console.log(projectInformation)

    // show the author information
    console.log(authorInformation)

    // show the help information
    console.log(helpInformation)
}

module.exports = {
    welcome,
}