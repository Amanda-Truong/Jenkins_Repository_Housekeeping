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
        // TODO check if a repo has a Jenkinsfile
        //.then(repositories => getRepositoryUpdatedDates(repositories))
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
/*
 JenkinsFile is a file in the actual code, observed in GitHub
 TODO : find a way to see if a repository has a Jenkinsfile, if yes: keep in list, else: don't */

function hasJenkinsfiles() {
    const test = new Promise(function (resolve, reject) {

        const repo = gh.getRepo(organizationName,"jenkins_repository_housecleaning");
        const information = repo.getContents("develop","Jenkinsfile");


        resolve(information);

        //for getting updated date later
        // repos.getDetails((error, data) =>{
        //     resolve(data.updated_at);
        // });
    })
        .catch(reason => handleRepositoryHooksError(reason))
        .then(resolve,reject);
}
function handleRepositoryHooksError(error) {
    reject("Something wicked this way come")
    if (error.response.status !== 404) {
        throw new Error(error.message);
    }
}
// working listing of updated dates
function getLast(){
    const updateMap = new Map();
    const test = new Promise(function (resolve, reject) {
        const repos = organization.getRepos((error, data) => {
           if(error) {
               reject(error);
           }
           else {
               const repo = data;
               for(let i = 0;i < repo.length;i++) {
                   updateMap.set(repo[i].name,repo[i].updated_at);
               }
               resolve(updateMap);
           }
        });
    })
        .then(resolve,reject);
}


exports.getLastUpdateDate = getLastUpdateDate;
exports.getLast = getLast;
exports.hasJenkinsfiles = hasJenkinsfiles;