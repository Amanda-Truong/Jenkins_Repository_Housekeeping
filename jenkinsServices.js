const jenkins = require("jenkins")
({ baseUrl: process.env.JENKINS_LINK, crumbIssuer: false });
// time to start anew TODO: use the new Jenkins to get all the info you did last time.  ALONS-Y
function getJenkinsJobs(repositories) {

    return Promise.resolve()
        .then(() => getFilteredJobsList(repositories))
        .then(result => getAllJobsInfo(result))
        //.then(() => getConfig())
        //.then(result => getJobInfo(result[0].name))
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
                            jobListFromRepo.push(jobs[j]);
                            break;
                        }
                    }
                }
                resolve(jobListFromRepo);
            }
        })
    })
}
function getAllJobsInfo(jobs){
    const jobList = [];
    for(let i = 0; i < jobs.length;i++) {
        jobList.push(getJobInfo(jobs[i].name));
    }
    return jobList;

}
function getJobInfo(jobName) {
    return new Promise(function(resolve, reject) {
        jenkins.job.get(jobName, (error, data) => {
            if (error) {
                reject(error)
            }
            else {
                resolve(data);
            }
        });
    })
        .then(result => {
            return {
                jobName,
                job:result

            }
        })
}


exports.getJenkinsJobs = getJenkinsJobs;