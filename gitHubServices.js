const GitHub = require('github-api');

const organizationName = process.env.GH_ORGANIZATION;
const gh = new GitHub({
    token: process.env.GH_ACCESS_TOKEN,
});
const organization = gh.getOrganization(organizationName);
resolve = console.log;
reject = console.log;

function getLastUpdateDate() {
    return Promise.resolve(gh.getOrganization(organizationName))
        .then(organization => organization.getRepos())
        .then(response => response.data.map(item => item.name).map(name => getRepositoryInfo(name)))
        .then(repositories => repositories.filter(repository => hasJenkinsFile(repository)))
        .then(repositories => getUpdatedDates(repositories))
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
function mapAndResolveAll(items, operation) {
    return Promise.all(items.map(item => operation(item)));
}
function hasJenkinsFile(repositoryInfo) {
    let status = false, reason;
    const repo = repositoryInfo.repositoryObject;
    const file = repo.getContents("develop","Jenkinsfile")
        .catch(reason => {
            handleJenkinsFileError(reason,repositoryInfo.details.repositoryName);
            //return false;
        })

}
function handleJenkinsFileError(error,repositoryName) {
    if (error.response.status === 404) {
        console.error('Jenkinsfile not found in', repositoryName);
    }
    else {
        throw new Error(error.message);
    }

}
function getUpdatedDates(repositoryInfo) {
    return mapAndResolveAll(repositoryInfo, getUpdatedDate);
}
function getUpdatedDate(repositoryInfo) {
    const repo = repositoryInfo.repositoryObject;
    repo.getDetails((error, data) =>{
        if(error) {
            reject(error);
        }
        const updatedDate = data.updated_at;
        return {
            repositoryObject: repo,
            details: {
                repositoryName: repositoryInfo.details.repositoryName,
                updatedDate
            }
        }
    });
}
exports.getLastUpdateDate = getLastUpdateDate;

