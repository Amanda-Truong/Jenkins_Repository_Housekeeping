const GitHub = require('github-api');
const organizationName = process.env.GH_ORGANIZATION;

const gh = new GitHub({
    token: process.env.GH_ACCESS_TOKEN,
});

function getLastUpdateDate(repositories)
{
    return Promise.resolve(gh.getOrganization(organizationName)
        .then(organization => organization.getRepos())
        .then(response => response.data.map(item => item.name).map(name => getRepositoryInfo(name)))
    const repo = repositoryInfo;

    const list = [];
    for(let i = 0; i < repositories.length;i++)
    {
        list.push(repositories[i].updated_at);
    }
    return list;
}
function getRepositoryInfo(repositoryName) {
    const repo = gh.getRepo(organizationName, repositoryName);
    return {
        repositoryObject: repo,
        details: {
            repositoryName
        }
    };
}

exports.getLastUpdateDate = getLastUpdateDate;