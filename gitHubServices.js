const GitHub = require('github-api');
const organizationName = process.env.GH_ORGANIZATION;
const gh = new GitHub({
    token: process.env.GH_ACCESS_TOKEN,
});
const organization = gh.getOrganization(organizationName);

function getLastUpdateDate()
{
    const repos = organization.getRepos((error,data) => {
        const repositories = data;
        //console.log(repositories.length);
        const list = [];
        for(let i = 0; i < repositories.length;i++)
        {
            list.push(repositories[i].updated_at);
        }
        console.log(list);
    });
}


exports.getLastUpdateDate = getLastUpdateDate;