const GitHub = require('github-api');
const organizationName = process.env.GH_ORGANIZATION;

const gh = new GitHub({
    token: process.env.GH_ACCESS_TOKEN,
});
const organization = gh.getOrganization(organizationName);


/*
//TODO edit for later to integrate into index.js
function getRepositoryInformation() {

    organization.getRepos((error,data) => {
        const repositories = data;

   // const repositoriesList = gh.getRepo(organizationName);
    console.log(repositories[0]);
}*/