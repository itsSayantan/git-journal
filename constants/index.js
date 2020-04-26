/**
 * commandList is an object where 
 * key is the mainCommand and 
 * commandArgumentsList is an object with key as command option and value = <description_of_the_argument>
 *
 */

const commandsList = {
    'create': {
        commandArgumentsList: {}
    },
    delete: {
        commandArgumentsList: {
            journalID: 'ID of the journal being deleted.'
        }
    },
    deleteall: {
        commandArgumentsList: {}
    },
    get: {
        commandArgumentsList: {
            journalID: 'ID of the journal being searched.'
        }
    },
    getall: {
        commandArgumentsList: {}
    },
    help: {
        commandArgumentsList: {}
    },
    'exit': {
        commandArgumentsList: {}
    }
}

module.exports = {
    commandsList,
}