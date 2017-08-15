const gitHubService = require("./gitHubServices");
const jenkinsService = require("./jenkinsServices");
function handler(event, context, callback)
{
    console.log('Event:', event);
    console.log('Context:', context);
    Promise.resolve()
        .then(() => gitHubService.getLastUpdateDate())
        .then(result => handleUpdatedDatesRepos(result))
        .then(result => jenkinsService.getJenkinsJobs(result))
        //.then(result => handleJenkinsInfo(result))

        .then(() => callback(null, "Done!!"))

        .catch((reason) => {
            console.error(reason);
            callback(reason);
        });
}
function handleUpdatedDatesRepos(result) {
    console.log('Jenkinsfile found in:\n', result);
    return result;
}
function handleJenkinsInfo(result) {
    console.log('Jenkins Job Info:\n', result);
}

exports.handler = handler;