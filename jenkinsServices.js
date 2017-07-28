const JenkinsAPI = require("jenkins-api");
const jenkins = JenkinsAPI.init(process.env.JENKINS_API_LINK);


function getJenkinsJobs(repositories) {

    return Promise.resolve()
        .then(() => filterJenkinsJobs(repositories))
        .then(result => getAllJobsInfo(result))
        .then(result => getConfigFiles(result))
        .then(result => console.log(result))
}

function filterJenkinsJobs(repositories){
    const jobListFromRepo = [];
    return new Promise(function (resolve, reject) {
         jenkins.all_jobs((err, data) => {
            if (err) {
                reject(err);
            }
            else {
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
        });
    })
}
function getAllJobsInfo(jobs) {
    const jobsInfoList = [];
    for(let i = 0; i < jobs.length; i++) {
        jobsInfoList.push(getJobInformation(jobs[i]))
    }
    return jobsInfoList;
}
function getJobInformation(job) {
    const jobName = job.name, jobUrl = job.url, jobClass = job._class;
    return {
        jobInfo: {
            jobName,
            jobUrl,
            jobClass
        }
    }
}
function getConfigFiles(jobs) {
    const list = [];
    for(let i = 0; i < jobs.length; i++) {
        list.push(getConfigFile(jobs[i]));
    }
    return list;
}
// key thing with the config.xml file, it only works if you are already longed into jenkins of that particular account
function getConfigFile(job) {
    const urlLength = job.jobInfo.jobUrl.length;
    const configFile = `https://${process.env.JENKINS_ACCESS_TOKEN}@${job.jobInfo.jobUrl.slice(8,urlLength)}config.xml`;
    return {
        config_xml_File: configFile,
        jobInfo: {
            jobName: job.jobInfo.jobName,
            jobUrl: job.jobInfo.jobUrl,
            jobClass: job.jobInfo.jobClass
        }
    }
}
exports.getJenkinsJobs = getJenkinsJobs;