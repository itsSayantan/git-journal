const {
    executeCreate,
    executeGet,
    executeGetAll,
    executeHelp,
    executeExit,
    executeDeleteAll,
    executeDelete,
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
    }
}

module.exports = {
    commandMap,
}