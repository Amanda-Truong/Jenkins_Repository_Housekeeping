const GitHub = require('github-api');

const organizationName = process.env.GH_ORGANIZATION;
const gh = new GitHub({
    token: process.env.GH_ACCESS_TOKEN,
});
const organization = gh.getOrganization(organizationName);
resolve = console.log;
reject = console.log;
/*
    TODO find out why date takes a few runs to appear
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
        organization.getRepos((error, data) => {
            if(error) {
                reject(error);
            }
            else {
                const repo = data;
                for(let i = 0;i < repo.length;i++) {
                    updates.push(repo[i].pushed_at); // the pushed date is newer than the updated dates, it is also more accurate to github's information.
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
            deniedList.push(repositoryInfo);
        })
        .then(() => {
            return {
                //repositoryObject: repo,
                repoInfo: {
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
        //console.error('Jenkinsfile not found in', repositoryName);
    }
    else {
        throw new Error(error.message);
    }
}

function filterList(repositories) {
    const list = [];
    for(let i = 0; i < repositories.length; i++) {
        if(repositories[i].repoInfo.hasJenkinsfile && compareDates(repositories[i].repoInfo.lastUpdatedDate)) {
            list.push(repositories[i]);
        }
        else {
            deniedList.push(repositories[i]);
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
const deniedList = [];
// this will push our the repos that do not have a Jenkinsfile or haven't been updated in the past 30 days
function getNotApplyList() {
    return deniedList;
}
exports.getLastUpdateDate = getLastUpdateDate;
exports.getNotApplyList = getNotApplyList;

