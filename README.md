# git-journal

Personal journal managed by Git.

# Introduction

git-journal is a tool for taking journal entries. git-journal uses git for storing the journal entries.

# Installation

```js
$ npm install -g git-journal
```

# Dependency

git-journal requires you to have git and nodejs installed on your local system. Also make sure that the ```git``` command is accessible.

# Usage

1. Make sure you install ```git-journal``` globally as mentioned in the above installation scripts. This is to ensure that ```git-journal``` is available throughout your system.

2. Open a terminal and run ```git-journal```

3. Enter command ```help``` to get a list of all available commands.

4. *Please note* if you are using the ```backup``` and ```restore``` feature, make sure you read [this section](#backup-and-restore).

# Commands

The commands that are currently supported are:

- backup <git_remote_url> [EXPERIMENTAL] - create a backup of all your journals to your remote git repository.

- create - create a new journal.

- delete <journal_id> - delete a journal with id: <journal_id>.

- deleteall - delete all journal entries.

- exit - exit the git-journal application.

- get <journal_id> - get a journal with id: <journal_id>.

- getall - get all journal entries.

- help - lists help information.

- resetapp - deletes the data folder containing all the journals and resets the application to its default. (Needs restart)

- restore <git_remote_url> [EXPERIMENTAL] - restore all the journals from your remote git repository to your local journals repository.

# Backup and Restore

Follow these steps to use ```backup``` and ```restore``` features.

1. Create a remote git repository called ```git-journals-data```.

2. It is always recommended to run the ```restore``` command whenever you open ```git-journal``` as any local change creates commits and a later execution of ```backup``` or ```restore``` commands may result in conflicts which then have to be resolved manually as per the current version of ```git-journal```.

3. Enter you git user id and password if you are being prompted in any of these commands.

4. After every ```backup``` operation, you can check your remote repository for all the commits that were made during the application usage. Notice there will be 'empty commits' for the backup operations. This is because the backup operation itself does not make any file changes, instead an empty commit helps keep better track of all your backups.

5. Please note these are experimental commands and might be buggy. Feel free to raise issues with proper steps to reproduce the issues page of ```git-journal```.