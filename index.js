const gitHubService = require("./gitHubServices");
const jenkinsService = require("./jenkinsServices");
function handler(event, context, callback)
{
    console.log('Event:', event);
    console.log('Context:', context);

    //console.log(gitHubService.getLastUpdateDate());
    Promise.resolve()
        .then(() => gitHubService.getLastUpdateDate())
        .catch((reason) => {
            console.error(reason);
            callback(reason);
        });
}
exports.handler = handler;