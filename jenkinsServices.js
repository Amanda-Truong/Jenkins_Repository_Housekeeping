const JenkinsAPI = require("jenkins-api");
const jenkins = JenkinsAPI.init('https://atruong:374ee9b0c289d76f5811d9aa66a27dee@prod-jenkins.newforma.io/job/Newforma/api/json?pretty=true');


function getJenkinsJobs(repositories) {

    return Promise.resolve()
        .then(() => filterJenkinsJobs(repositories))
        .then(result => console.log(result))
}
const jobListFromRepo = [];
function filterJenkinsJobs(repositories){

    return new Promise(function (resolve, reject) {
         jenkins.all_jobs_in_view("newforma.cloud",(err, data) => {
            if (err) {
                reject(err);
            }
            else {
                const jobs = data;
                for(let i = 0; i < repositories.length;i++) {
                    for(let j = 0; j < jobs.length; j++) {
                        if(repositories[i].details.repositoryName === jobs[j].name) {
                            //console.log(jobs[j].name);
                            jobListFromRepo.push(jobs[j]);
                            break;
                        }
                    }
                }
                resolve(jobListFromRepo);
            }
        });
    })
        .then(result => {return result})
}

exports.getJenkinsJobs = getJenkinsJobs;
exports.filterJenkinsJobs = filterJenkinsJobs;