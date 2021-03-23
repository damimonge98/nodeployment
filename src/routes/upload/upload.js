const express = require("express");
const router = express.Router();
const csvUpload = require("../../../multer");
const csv = require("csv-parser");
const fs = require("fs");
const Invitation = require("../../models/invitation");
const { CLIENT_URL } = process.env;
const { sendEmail } = require("../mail");

router.post("/users", csvUpload, (req, res, next) => {
  const users = [];
  const filePath = req.file.path;
  // Parsing csv data.
  fs.createReadStream(filePath)
    .pipe(csv({}))
    .on("data", (data) => users.push(data))
    .on("error", (err) => console.log(err))
    .on("end", async () => {
      // Check if csv has email and github username.
      const hasEmail = users[0].hasOwnProperty("email");
      const hasGithub = users[0].hasOwnProperty("githubUsername");
      const validObj = hasEmail && hasGithub;
      if (validObj) {

        const added = [];
        const notAdded = [];


        await Promise.all(users.map(async u => {
          try {
            const invitation = await Invitation.create({
              email: u.email,
              githubUsername: u.githubUsername
            });



            try {
              const subject = "🚀 | Admitido a Henry";
              const text = `
              Felicidades! Ya puedes logearte en tu cuenta, para acceder al material.
              Debes completar el registro con el siguiente mail: ${u.email}
              Finaliza con el registro en el siguiente link: ${CLIENT_URL + "/register"}
              `;

              sendEmail(u.email, subject, text);
            } catch (err) {
              console.log(err);
            }
            added.push(invitation);
          } catch (error) {
            notAdded.push({ user: u, error });
          }
        }));


        return res.status(200).send({
          totalInvited: added.length,
          totalNotInvited: notAdded.length,
          invited: added,
          notInvited: notAdded
        });
      } else {
        // Remove csv, and return an bad req response.
        fs.unlink(filePath, () => {
          return res.status(400).json({
            msg: `Error: Missing csv data. Add${!hasEmail ? " email" : ""} ${!hasGithub ? "githubUsername " : ""}colums.`,
          });
        });
      }
    });
});

module.exports = router;
