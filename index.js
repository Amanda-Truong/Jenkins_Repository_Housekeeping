const gitHubService = require("./gitHubServices");
const jenkinsService = require("./jenkinsServices");
function handler(event, context, callback)
{
    console.log('Event:', event);
    console.log('Context:', context);

    Promise.resolve()
        .then(() => gitHubService.getLastUpdateDate())
        .then(() => callback(null, "Done!!"))

        .catch((reason) => {
            console.error(reason);
            callback(reason);
        });
}

// TODO have it print out names and dates of the list
exports.handler = handler;