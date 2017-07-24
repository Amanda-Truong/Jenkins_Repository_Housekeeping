const JenkinsAPI = require("jenkins-api");
const jenkins = JenkinsAPI.init(process.env.JENKINS_API_LINK);



//TODO look at your notepad, I put a list of what our next time should be deary.
//TODO Look up how to use Jenkins API methods, this is found at https://www.npmjs.com/package/jenkins-api
// we can focus on other stuff once we get the hang of it.
function getJenkinsJobs(repositories) {

    return Promise.resolve()
        .then(() => filterJenkinsJobs(repositories))
    //.then(jenkins => jenkins.all_jobs())
        //.then(jobs => filtering(repositories,jobs))
}

function filterJenkinsJobs(repositories){
    const jobListFromRepo = [];
        return jenkins.all_jobs(function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                const jobs = data;
                for(let i = 0; i < repositories.length;i++) {
                    for(let j = 0; j < jobs.length; j++) {
                        if(repositories[i].details.repositoryName == jobs[j].name) {
                            jobListFromRepo.push(jobs[j]);
                        }
                    }
                }
                console.log(jobListFromRepo);
            }
        })
}

exports.getJenkinsJobs = getJenkinsJobs;
exports.filterJenkinsJobs = filterJenkinsJobs;