const gitHubService = require("./gitHubServices");
const jenkinsService = require("./jenkinsServices");
function handler(event, context, callback)
{
    console.log('Event:', event);
    console.log('Context:', context);

    Promise.resolve()
        .then(() => gitHubService.hasJenkinsfiles())
        //.then(() => gitHubService.getLast())
        //.then(() => gitHubService.getLastUpdateDate())
        .then(() => callback(null, "Done!!"))

        .catch((reason) => {
            console.error(reason);
            callback(reason);
        });
}
exports.handler = handler;