const {
    executeBackup,
    executeCreate,
    executeGet,
    executeGetAll,
    executeHelp,
    executeExit,
    executeDeleteAll,
    executeDelete,
    executeResetApp,
    executeRestore,
} = require('./commands')

const commandMap = {
    backup: {
        execute: executeBackup
    },
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
    restore: {
        execute: executeRestore
    }
}

module.exports = {
    commandMap,
}