const jenkins = require("jenkins")
({ baseUrl: process.env.JENKINS_LINK, crumbIssuer: false });
//TODO figure out if i need some sort of permission to activate it or if i need to edit another config.xml
function getJenkinsJobs(repositories) {

    return Promise.resolve()
        .then(() => getFilteredJobsList(repositories))
        .then(result => getAllJobsInfo(result))
        .then(result => getAllJobsConfig(result))
        .then(result => getAllNewJobConfigs(result))

        //.then(result => console.log(result))
}

//returns all the jobs that were from the filtered repo list
function getFilteredJobsList(repositories) {
    return new Promise(function(resolve, reject) {
        jenkins.job.list((err, data) => {
            if(err) {
                reject(err);
            }
            else {
                const jobListFromRepo = [];
                const jobs = data;
                for(let i = 0; i < repositories.length;i++) {
                    for(let j = 0; j < jobs.length; j++) {
                        if(repositories[i].repoInfo.repositoryName === jobs[j].name) {
                            jobListFromRepo.push(jobs[j].name);
                            break;
                        }
                    }
                }
                resolve(jobListFromRepo);
            }
        })
    })
}
function mapAndResolveAll(items, operation) {
    return Promise.all(items.map(item => operation(item)));
}
// get the job information
function getAllJobsInfo(jobNames){
    return mapAndResolveAll(jobNames,getJobInfo);
}
function getJobInfo(jobName) {
     return  new Promise(function(resolve, reject) {
        jenkins.job.get(jobName, (error, data) => {
            if(error)
                reject(error);
            else {
                resolve(data);
            }
        });
    })
        .then(result => {
            return {
                jobName,
                jobInfo: result
            }
        })
}
// get the original config.xml file
function getAllJobsConfig(jobs) {
    return mapAndResolveAll(jobs,getJobConfig)
}
function getJobConfig(job) {
    return new Promise(function(resolve,reject) {
        jenkins.job.config(job.jobName,(error,data)=>{
            if(error) {
                reject(error);
            }
            else {
                console.log(data);
                resolve(data);
            }
        })

    })
        .then(result => {
            return {
                jobName: job.jobName,
                jobInfo: job.jobInfo,
                configXML:  result

            }
        });
}
// creates the new config.xml file
function getAllNewJobConfigs(jobs) {
    return mapAndResolveAll(jobs, getNewJobConfig)
}
function getNewJobConfig(job) {
    let newConfig = job.configXML;
    const triggerStart = newConfig.indexOf('<triggers'), triggerEnd = job.configXML.indexOf('<disable');

    const sub = newConfig.slice(triggerStart,triggerEnd);

    newConfig = newConfig.replace(sub, "\<triggers/\>\n  ");

        return {
            jobName: job.jobName,
            jobInfo: job.jobInfo,
            configXML: job.configXML,
            newConfig
        }
}
exports.getJenkinsJobs = getJenkinsJobs;