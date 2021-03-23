const express = require ("express");
const server = express.Router();
var githubApi= require('github-api-basic/github-api');
const { TOKEN_GITHUB } = process.env



server.post("/", (req,res) => {
    const url = "/" + req.body.ReadmeUrl
    githubApi(TOKEN_GITHUB, url )
  .then(function (response) {
    res.json(response.body);
  })
  .catch(function (err) {
    console.error(err);
  });    

  })

module.exports = server;


