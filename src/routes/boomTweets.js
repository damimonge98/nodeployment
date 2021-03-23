const express = require ("express");
const server = express.Router();
const Boom = require ("../models/booms")

server.get("/", (req,res) => {
    Boom.find()
    .then (booms => {
      res.json (booms)
    })
  })

module.exports = server;