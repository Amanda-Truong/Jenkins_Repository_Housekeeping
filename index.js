//const gitHubService = require(gitHubService.js);
const GitHub = require('github-api');
const organizationName = process.env.GH_ORGANIZATION;
function handler(event, context, callback)
{
    try{
        const gh = new GitHub({
            token: process.env.GH_ACCESS_TOKEN,
        });

        const organization = gh.getOrganization(organizationName);
        organization.getRepos((error,data) => {
            const repositories = data;
            console.log(repositories)
        });

        callback(null,"Success!!")
    } catch(e) {
        control.error("Exception: %s", e.message);
        callback(e);
    }
}
exports.handler = handler;