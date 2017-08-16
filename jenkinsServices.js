const jenkinsHome = require("jenkins")
({baseUrl: process.env.JENKINS_HOME_LINK, crumbIssuer: true});
function getJenkinsJobs(repositories) {

    return Promise.resolve()
        .then(() => getFilteredJobsList(repositories))
        .then(result => regexMaker(result))
        .then(result => editMainXML(result))
        .then(result => setMainXML(result))
}

//returns all the jobs that were from the filtered repo list
function getFilteredJobsList(repositories) {
    return new Promise(function(resolve, reject) {
        const jobListFromRepo = [];
        for(let i = 0; i < repositories.length;i++) {
            jobListFromRepo.push(repositories[i].repoInfo.repositoryName);
        }
        resolve(jobListFromRepo);
    })
}
// creates the string that should sit in the <regex> line
function regexMaker(jobNames){
    if(jobNames.length === 1) {
        return jobNames[0];
    }
    else {
        let string = ".?(" + jobNames[0];
        for(let i = 1; i < jobNames.length;i++) {
            string += ("|" + jobNames[i]);
        }
        string += ").?";
        return string;
    }
}

// edits the main config.xml file so that the regex will scan only the listed.
function editMainXML(newRegex){
    return new Promise(function(resolve, reject){
        jenkinsHome.job.config(process.env.GH_ORGANIZATION,(error, data) =>{
            if(error) {
                reject(error);
            }
            else {
                resolve(data);
            }
        })
    })
        .then(result => {
            let mainConfig = result;
            const triggerStart = mainConfig.indexOf('<regex');
            const triggerEnd = mainConfig.indexOf('        </jenkins.s');
            const sub = mainConfig.slice(triggerStart,triggerEnd);
            return mainConfig.replace(sub, "<regex>" + newRegex + "</regex>\n");
        })
}

function setMainXML(newConfig) {
    jenkinsHome.job.config(process.env.GH_ORGANIZATION,newConfig,(error)=>{
        if(error){
            console.error(error);
        }
    })
}
exports.getJenkinsJobs = getJenkinsJobs;