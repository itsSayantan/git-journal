# git-journal

Personal journal managed by Git.

# Introduction

git-journal is a tool for taking journal entries. git-journal uses git for storing the journal entries.

# Dependency

git-journal requires you to have git installed on your local system. Also make sure that the ```git``` command is accessible.

# Commands

The commands that are currently supported are:

- create - create a new journal.

- delete <journal_id> - delete a journal with id: <journal_id>.

- deleteall - delete all journal entries.

- exit - exit the git-journal application.

- get <journal_id> - get a journal with id: <journal_id>.

- getall - get all journal entries.

- help - lists help information.

- resetapp - deletes the data folder containing all the journals and resets the application to its default. (Needs restart)