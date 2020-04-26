const {
    executeCreate,
    executeGet,
    executeGetAll,
    executeHelp,
    executeExit,
    executeDeleteAll,
    executeDelete,
    executeResetApp,
} = require('./commands')

const commandMap = {
    create: {
        execute: executeCreate
    },
    delete: {
        execute: executeDelete
    },
    deleteall: {
        execute: executeDeleteAll
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
    },
    resetapp: {
        execute: executeResetApp
    },
}

module.exports = {
    commandMap,
}