const GitHub = require('github-api');
const organizationName = process.env.GH_ORGANIZATION;
const gh = new GitHub({
    token: process.env.GH_ACCESS_TOKEN,
});

function getLastUpdateDate(){
    return Promise.resolve(gh.getOrganization(organizationName))
        .then(organization => organization.getRepos())
        .then(response => response.data.map(item => item.name).map(name => getRepositoryInfo(name)))
        // TODO check if a repo has a Jenkins File
        .then(repositories => getRepositoryUpdatedDates(repositories))
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
function getRepositoryUpdatedDates(repositoryInfos) {
    return mapAndResolveAll(repositoryInfos, getRepositoryUpdatedDate);
}
function getRepositoryUpdatedDate(repositoryInfo) {
    const repo = repositoryInfo.repositoryObject;
    return {
        repositoryObject: repo,
        details: {
            updatedDate: repositoryInfo.details.updated_at,
        }

    }
}
function mapAndResolveAll(items, operation) {
    return Promise.all(items.map(item => operation(item)));
}
exports.getLastUpdateDate = getLastUpdateDate;