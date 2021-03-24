const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../../models/user');
const Invitation = require('../../models/invitation');
const { isUser, isAdmin } = require("../../middlewares/auth");
const { JWT_SECRET } = process.env;

router.get("/me", isUser, async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/register', (req, res, next) => {
  const { email, firstName, lastName, password } = req.body;
  let image = `https://robohash.org/${firstName, lastName}.png`;

  User.findOne({ email }, async (err, user) => {
    try {
      if (user) res.send('Este usuario ya existe.');

      if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const invitation = await Invitation.findOne({ email });

        let userData = {
          email,
          firstName,
          lastName,
          avatar: image,
          password: hashedPassword,
        };
        if (invitation) {
          userData = { ...userData, role: "student", currentModule: 1, githubUsername: invitation.githubUsername };
          invitation.delete();
        }

        const newUser = new User(userData);
        await newUser.save();
        res.send({ done: true, msg: 'Nuevo usuario registrado.' });
      }
    } catch (err) {
      next(err);
    }
  });
});

router.post('/register-company', (req, res, next) => {
  const { email, companyName, password } = req.body;
  let image = `https://robohash.org/${companyName}.png`;

  User.findOne({ email }, async (err, company) => {
    try {
      if (company) res.send('Empresa ya registrada.');

      if (!company) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          email,
          companyName,
          avatar: image,
          password: hashedPassword,
          role: 'company'
        });
        await newUser.save();
        res.send({ done: true, msg: 'Nueva empresa registrada.' });
      }
    } catch (err) {
      next(err);
    }
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return res.status(400).json({ errors: err });
    }
    if (!user) {
      return res.status(400).json({ errors: 'Usuario no encontrado.' });
    }

    try {
      const result = await User.findById(user.id);
      return res.json({ token: jwt.sign(JSON.stringify(result), JWT_SECRET), user: result });
    } catch (error) {
      next(error);
    }

  })(req, res, next);
});

router.get('/google', passport.authenticate('google', { scope: ['profile', "email"] }));

router.get('/google/callback', passport.authenticate('google'), async (req, res) => {
  // Successful authentication, redirect to client.
  const user = await User.findOne({ googleId: req.user.id });
  const token = jwt.sign(JSON.stringify(user), JWT_SECRET);
  return res.redirect(`https://henry-app-sage.vercel.app/oauth/${token}`);
});

router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback',
  passport.authenticate('github'),
  async (req, res) => {
    // Successful authentication, redirect home.
    const user = await User.findOne({ githubId: req.user.id });
    const token = jwt.sign(JSON.stringify(user), JWT_SECRET);
    res.redirect(`https://henry-app-sage.vercel.app/oauth/${token}`);
  });

module.exports = router;
