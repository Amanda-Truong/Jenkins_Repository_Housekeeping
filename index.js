 const gitHubService = require("./gitHubServices");
function handler(event, context, callback)
{
    try{
        gitHubService.getLastUpdateDate();

        callback(null,"Success!!")
    } catch(e) {
        control.error("Exception: %s", e.message);
        callback(e);
    }
}
exports.handler = handler;