const gitHubService = require("./gitHubServices");
const jenkinsService = require("./jenkinsServices");
function handler(event, context, callback)
{
    console.log('Event:', event);
    console.log('Context:', context);

    Promise.resolve()
        .then(() => gitHubService.getLastUpdateDate())
        .then(result => handleUpdatedDatesResult(result))
        .then(() => callback(null, "Done!!"))

        .catch((reason) => {
            console.error(reason);
            callback(reason);
        });
}
function handleUpdatedDatesResult(result) {
    console.log('Jenkinsfile found in:', result);
    return result
      //  .map(item => item.repository);
}

// TODO have it print out names and dates of the list
exports.handler = handler;