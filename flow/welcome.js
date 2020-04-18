const fs = require('fs')
const path = require('path')

const welcomeMessage = `*****************************
        GIT - NOTES
*****************************`

// dynamically find out the project from the package.json file
const projectVersion = JSON.parse(fs.readFileSync(path.join(__dirname + '/../package.json'))).version

const projectInformation = `\nVersion: ${projectVersion}\n\nProject URL: https://github.com/itsSayantan/git-notes`

const authorInformation = `\nAuthor: Sayantan Ghosh\nWebiste: https://sayantan-ghosh.herokuapp.com\nGithub Profile: https://github.com/itsSayantan`

const helpInformation = `\nEnter command: 'help' to get the list of commands or enter 'exit' to exit the application.`

const welcome = () => {
    // show the welcome message, only if the application is not being run in the debug mode

    if (process.env.NODE_DEBUG !== 'git-notes')
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