const jenkinsJobs = require("jenkins")
({ baseUrl: process.env.JENKINS_LINK});
const jenkinsHome = require("jenkins")
({baseUrl: process.env.JENKINS_HOME_LINK, crumbIssuer: true});
//TODO figure out if i need some sort of permission to activate it or if i need to edit another config.xml
function getJenkinsJobs(repositories) {

    return Promise.resolve()
         .then(() => getFilteredJobsList(repositories))
        // .then(result => getAllJobsInfo(result))
        // .then(result => getAllJobsConfig(result))
        // .then(result => getAllNewJobConfigs(result))
        //.then(result => setAllNewConfigs(result))
        .then(result => regexMaker(result))
        .then(result => editMainXML(result))
        .then(result => setMainXML(result))
         //.then(() => tester1())

        //.then(result => console.log(result))
}

//returns all the jobs that were from the filtered repo list
function getFilteredJobsList(repositories) {
    return new Promise(function(resolve, reject) {
        jenkinsJobs.job.list((err, data) => {
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
                            //jobListFromRepo.push("cloud-preview");
                            break;
                        }
                    }
                }
                resolve(jobListFromRepo);
            }
        })
    })
}
function regexMaker(jobNames){
    if(jobNames.length === 1) {
        return jobNames[0];
    }
    else {
        let string = ".*(" + jobNames[0];
        for(let i = 1; i < jobNames.length;i++) {
            string += ("|" + jobNames[i]);
        }
        string += ").*";
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
        else {
            console.log("Mischief Managed");
        }
    })
}



/*function mapAndResolveAll(items, operation) {
    return Promise.all(items.map(item => operation(item)));
}
// get the job information
function getAllJobsInfo(jobNames){
    return mapAndResolveAll(jobNames,getJobInfo);
}
function getJobInfo(jobName) {
     return  new Promise(function(resolve, reject) {
        jenkinsJobs.job.get(jobName, (error, data) => {
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
        jenkinsJobs.job.config(job.jobName,(error,data)=>{
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
    //console.log(newConfig);
        return {
            jobName: job.jobName,
            jobInfo: job.jobInfo,
            configXML: job.configXML,
            newConfig
        }
}
function setAllNewConfigs(jobs) {
    return mapAndResolveAll(jobs, setNewConfig);
}
function setNewConfig(job)
{
    jenkinsJobs.job.config(job.jobName, job.newConfig, (error) => {
        if (error) {
            console.error(error);
        }
        else {
            console.log("passaby")
        }
    });
    return job;

}*/

exports.getJenkinsJobs = getJenkinsJobs;