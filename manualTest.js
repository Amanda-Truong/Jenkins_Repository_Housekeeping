// See: https://github.com/motdotla/dotenv#usage
require('dotenv').config();
const app = require("./index");

const event = {
    data: 'this is event test data',
};
const context = {
    data: 'this is context test data',
};
function callback(error, success) {
    if (error) {
        console.error('An error happened:', error);
        return;
    }
    console.log(success);
}

app.handler(event, context, callback);