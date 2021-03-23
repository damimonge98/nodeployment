const express = require("express");
const nodemailer = require("nodemailer");
const server = express.Router();

const sendEmail = (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'apphenry247@gmail.com',
      pass: 'henry$ft07'
    }
  });

  const mailOptions = {
    from: 'apphenry247@gmail.com',
    to: email,
    subject: subject,
    text
  };

  transporter.sendMail({ ...mailOptions, subject: subject }, (error, info) => {
    if (error) {
      res.status(500).send(error.message);
      console.log(error);
    } else {
      console.log('Email enviado.');
      res.status(200).json(req.body);
    }
  });
};

// TODO: Change route to /emailVerification
server.post('/', (req, res) => {
  const email = req.body.email;
  const text = req.body.text;
  const subject = req.body.subject;
  const attachments = req.body.attachments;
  const adjunto = req.query.adjunto;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'apphenry247@gmail.com',
      pass: 'henry$ft07'
    }
  });

  const mailOptions = {
    from: 'apphenry247@gmail.com',
    to: email || "henryAdmin@henry.com",
    subject: subject || `Verificacion de cuenta`,
    text: text || `mostrar mensaje aqui`,
    attachments: [{
      fileName: adjunto,
      path: attachments
    }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error.message);
      console.log(error);
    } else {
      console.log('Email enviado.');
      res.status(200).json(req.body);
    }
  });
});


module.exports = { mailRoutes: server, sendEmail };









/*  const express = require("express");
const nodemailer = require("nodemailer");
const server = express.Router();

const sendEmail = (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'earlene.king51@ethereal.email',
      pass: 'fTphNrFzuf6wKfqykV'
    }
  });

  const mailOptions = {
    from: 'apphenry247@gmail.com',
    to: email,
    subject: subject,
    text

  };

  transporter.sendMail({ ...mailOptions, subject: subject }, (error, info) => {
    if (error) {
      res.status(500).send(error.message);
      console.log(error);
    } else {
      console.log('Email enviado.');
      res.status(200).json(req.body);
    }
  });
};

// TODO: Change route to /emailVerification
server.post('/', (req, res) => {
  const email = req.body.email;
  const text = req.body.text;
  const subject = req.body.subject;
  const attachments = req.body.attachments;
  const adjunto = req.query.adjunto;
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'earlene.king51@ethereal.email',
      pass: 'fTphNrFzuf6wKfqykV'
    }
  });

  const mailOptions = {
    from: 'apphenry247@gmail.com',
    to: email || "henryAdmin@henry.com",
    subject: subject || `Verificacion de cuenta`,
    text: text || `mostrar mensaje aqui`,
    attachments: [{
      fileName: adjunto,
      path: attachments
    }]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error.message);
      console.log(error);
    } else {
      console.log('Email enviado.');
      res.status(200).json(req.body);
    }
  });
});


module.exports = { mailRoutes: server, sendEmail };  */