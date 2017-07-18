const JenkinsAPI = require("jenkins-api");
const jenkins = JenkinsAPI.init(`https://${process.env.JENKINS_ACCESS_TOKEN}prod-jenkins.newforma.com`);

const err = "Mischief Progresses";

//TODO Basically everything, but we can look at that a little later deary.
function testJenkins(){
    jenkins.all_jobs(function(err, data) {
        if (err){ return console.log(err); }
        console.log(data)
    });
}