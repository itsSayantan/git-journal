const {
    executeCreate,
    executeGet,
    executeGetAll,
    executeHelp,
    executeExit,
} = require('./commands')

const commandMap = {
    create: {
        execute: executeCreate
    },
    get: {
        execute: executeGet
    },
    getall: {
        execute: executeGetAll
    },
    help: {
        execute: executeHelp
    },
    exit: {
        execute: executeExit
    }
}

module.exports = {
    commandMap,
}