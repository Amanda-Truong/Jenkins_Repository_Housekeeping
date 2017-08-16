# jenkins_repository_housekeeping

## Goal
Scan and compile a list of GitHub repositories which include a Jenkins File and has been modified within 30 days
## Install and run locally

Clone the repository, open a terminal on the project's root directory and execute:

    npm install
    
The tasks that support the execution and development of the project are defined in the `scripts` property of the [package.json](package.json) file, at the root directory.

In order to run a task, execute:

    npm run [name of the task]
    
### Environment variables

In order to run the application locally, a number of environment variables must be set:

Key | Description
-- | --
GH_ORGANIZATION | Name of the organization that owns the GitHub repositories
GH_ACCESS_TOKEN | GitHub access token
JENKINS_HOME_LINK | Link to the Jenkin's Main Menu. Should be formatted 'https://username:jenkins_token@jenkinslink.io'

The [manualTest.js](integration/manualTest.js) file uses the [dotenv](https://www.npmjs.com/package/dotenv) npm package to make it easier to manage these environment variables.

Ir order to run the manual tests, create a file named `.env` at the root of the project and add environment-specific variables on new lines in the form of `NAME=VALUE`.

For example:

    GH_ORGANIZATION=my-company
    GH_ACCESS_TOKEN=token
    ...

Then, run the file with Node.js from the root directory of the project:

    node integration/manualTest.js
