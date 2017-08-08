const jenkins = require("jenkins")
({ baseUrl: process.env.JENKINS_LINK, crumbIssuer: false });
// time to start anew TODO: use the new Jenkins to get all the info you did last time.  ALONS-Y
function getJenkinsJobs(repositories) {

    return Promise.resolve()
        .then(() => getFilteredJobsList(repositories))
        .then(result => getAllJobsInfo(result))
        .then(result => getAllJobsConfig(result))
        .then(result => console.log(result))
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
                jobInfo:result
            }
        })
}
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
                resolve(data);
            }
        })

    })
        .then(result => {
            return {
                jobName: job.jobName,
                jobInfo: job.jobInfo,
                configXML: result

            }
        });
}


exports.getJenkinsJobs = getJenkinsJobs;