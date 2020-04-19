const { executeCreate } = require('./commands')

const commandMap = {
    create: {
        execute: executeCreate
    }
}

module.exports = {
    commandMap,
}