const GitHub = require('github-api');

const organizationName = process.env.GH_ORGANIZATION;
const gh = new GitHub({
    token: process.env.GH_ACCESS_TOKEN,
});
function getLastUpdateDate() {
    return Promise.resolve(gh.getOrganization(organizationName))
        .then(organization => organization.getRepos())
        .then(response => response.data.map(item => item.name).map(name => getRepositoryInfo(name)))
        .then(repositories => checkJenkinsFiles(repositories))
        .then(repositories => filterJenkinsList(repositories))
        .then(repositories => getAllUpdatedDates(repositories))
        .then(repositories => filterDatesList(repositories))
}

function getRepositoryInfo(repositoryName) {
    const repo = gh.getRepo(organizationName, repositoryName);
    return {
        repositoryObject: repo,
        details: {
            repositoryName,

        }
    };
}

// gets the information on the last pushed date.
function getAllUpdatedDates(repositories) {
    return mapAndResolveAll(repositories, getUpdatedDate)
}
function getUpdatedDate(repositoryInfo) {
    return new Promise(function(resolve, reject) {
        const repo = repositoryInfo.repositoryObject;
        repo.getDetails((error, data) => {
            if(error) {
                reject(error);
            }
            else {
                resolve(data.pushed_at);
            }
        })
    })
        .then(result => {
            return {
                repoInfo: {
                    repositoryName: repositoryInfo.details.repositoryName,
                    lastUpdatedDate: result
                }
            }
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
            handleJenkinsFileError(reason);
            hasJenkinsfile = false;
        })
        .then(() => {
            return {
                repositoryObject: repo,
                details: {
                    repositoryName: repositoryInfo.details.repositoryName,
                    hasJenkinsfile
                }
            };
        })
}
function checkJenkinsFiles(repositoryInfos) {
    return mapAndResolveAll(repositoryInfos, hasJenkinsFile);
}
function handleJenkinsFileError(error) {
    if (error.response.status !== 404) {
        throw new Error(error.message);
    }
}
// filters out all of the repos that don't have the Jenkinsfile
function filterJenkinsList(repositories) {
    const list = [];
    for(let i = 0; i < repositories.length; i++) {
        if(repositories[i].details.hasJenkinsfile ) {
            list.push(repositories[i]);
        }
    }
    return list;
}

// filters out all repos that haven't pushed anything after 30 days.
function filterDatesList(repositories) {
    const list = [];
    for(let i = 0; i < repositories.length; i++) {
        if(compareDates(repositories[i].repoInfo.lastUpdatedDate)) {
            list.push(repositories[i]);
        }
    }
    return list;
}

function compareDates(repoDate) {
    // this is because of the whole updated date undefined thing for the first few runs
    if(repoDate === undefined)
        return true;

    //gets date of 30 days from run
    const day30 = new Date();
    day30.setDate(day30.getDate()-30);

    const newRepoDate = new Date();
    newRepoDate.setFullYear(repoDate.slice(0,4),Number(repoDate.slice(5,7))-1,repoDate.slice(8,10));
    if(newRepoDate >= day30)
        return true;
    else
        return false;
}
exports.getLastUpdateDate = getLastUpdateDate;

