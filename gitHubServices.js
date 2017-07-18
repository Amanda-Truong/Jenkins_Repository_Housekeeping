const GitHub = require('github-api');

const organizationName = process.env.GH_ORGANIZATION;
const gh = new GitHub({
    token: process.env.GH_ACCESS_TOKEN,
});
const organization = gh.getOrganization(organizationName);
resolve = console.log;
reject = console.log;
/*
    TODO figure out how to filter out the non jenkinsfile repos| find out why date takes a few runs to appear
 */
function getLastUpdateDate() {
    getUpdatedDate();
    return Promise.resolve(gh.getOrganization(organizationName))
        .then(organization => organization.getRepos())
        .then(response => response.data.map(item => item.name).map(name => getRepositoryInfo(name)))
        .then(repositories => checkJenkinsFiles(repositories))
        .then(repositories => filterList(repositories))
}

function getRepositoryInfo(repositoryName) {
    const repo = gh.getRepo(organizationName, repositoryName);
    //console.log(repo);
    const lastUpdatedDate = updates[count];
    count++;
    return {
        repositoryObject: repo,
        details: {
            repositoryName,
            lastUpdatedDate

        }
    };
}
let count = 0;
const updates = [];
// ^^gets the dates and push it into a global array.  The index should be the same as the other so they sync up
function getUpdatedDate() {
    const test = new Promise(function (resolve, reject) {
        const repos = organization.getRepos((error, data) => {
            if(error) {
                reject(error);
            }
            else {
                const repo = data;
                for(let i = 0;i < repo.length;i++) {
                    updates.push(repo[i].updated_at);
                }
            }
        });
    })
}
function mapAndResolveAll(items, operation) {
    return Promise.all(items.map(item => operation(item)));
}
// Getting the Jenkinsfile and setting the repo info about if it has it or not
function hasJenkinsFile(repositoryInfo) {
    let hasJenkinsfile = true;
    const repo = repositoryInfo.repositoryObject;
    return repo.getContents("develop","Jenkinsfile")
        .catch(reason => {
            handleJenkinsFileError(reason,repositoryInfo.details.repositoryName);
            hasJenkinsfile = false;
        })
        .then(() => {
            return {
                //repositoryObject: repo,
                details: {
                    repositoryName: repositoryInfo.details.repositoryName,
                    lastUpdatedDate: repositoryInfo.details.lastUpdatedDate,
                    hasJenkinsfile
                }
            };
        })
}
function checkJenkinsFiles(repositoryInfos) {
    return mapAndResolveAll(repositoryInfos, hasJenkinsFile);
}
function handleJenkinsFileError(error,repositoryName) {
    if (error.response.status === 404) {
        console.error('Jenkinsfile not found in', repositoryName);
    }
    else {
        throw new Error(error.message);
    }
}

function filterList(repositories) {
    const list = [];
    for(let i = 0; i < repositories.length; i++) {
        if(repositories[i].details.hasJenkinsfile) {
            list.push(repositories[i]);
        }
    }
    return list;
}
exports.getLastUpdateDate = getLastUpdateDate;

