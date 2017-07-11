const Jenkins = require("jenkins-api");
const jenkins = Jenkins.init("https://prod-jenkins.newforma.io");

const err = "Mischief Progresses";

function getData() {
    jenkins.all_jobs((err,data) => {
        if(err) {
            return console.log(err);
        }
        console.log(data);
    });
}
exports.getData = getData;