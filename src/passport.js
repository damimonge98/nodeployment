const User = require('./models/user');
const Invitation = require('./models/invitation');
const bcrypt = require('bcryptjs');
const passport = require("passport");
const jwt = require("jsonwebtoken");
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const { JWT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;


passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // Match User
    User.findOne({ email })
      .then(user => {
        // Create new User
        if (!user) {
          const newUser = new User({ email, password });
          // Hash password before saving in database
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) console.log(err);
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  return done(null, user);
                })
                .catch(err => {
                  return done(null, false, { message: err });
                });
            });
          });
          // Return other user
        } else {
          // Match password
          User.findOne({ email }).select('password').exec((err, user) => {
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) console.log(err);

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Contraseña incorrecta.' });
              }
            });
          });
        }
      })
      .catch(err => {
        return done(null, false, { message: err });
      });
  })
);

// Estrategia para logearse con Google.
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback"
},
  async (accessToken, refreshToken, profile, cb) => {
    try {

      const invitation = await Invitation.findOne({ email: profile.emails[0].value });

      let userData = {
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
      };
      if (invitation) {
        userData = { ...userData, role: "student", currentModule: 1, githubUsername: invitation.githubUsername };
        invitation.delete();
      }
      await User.findOneAndUpdate({ googleId: profile.id }, {
        ...userData
      }, { upsert: true, useFindAndModify: false });


      return cb(null, profile);
    } catch (error) {
      console.log(error);
      return cb(error, null);
    }
  }
));

// Estrategia para verificar que el JWT sea valido.
passport.use(
  new BearerStrategy((token, done) => {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return done(err);

      return done(null, user ? user : false);
    });
  })
);

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/github/callback",
  scope: ['user:email']
},
  async (accessToken, refreshToken, profile, done) => {
    try {

      const invitation = await Invitation.findOne({ email: profile.emails[0].value });

      let userData = {
        firstName: profile.username,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        githubUsername: profile.username,
      };
      if (invitation) {
        userData = { ...userData, role: "student", currentModule: 1 };
        invitation.delete();
      }

      await User.findOneAndUpdate({ githubId: profile.id }, {
        ...userData
      }, { upsert: true, useFindAndModify: false });
      return done(null, profile);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, cb) => { // Creates cookie
  cb(null, user.id); // with user.id inside
});

passport.deserializeUser((id, cb) => {
  User.findOne({ _id: id }, (err, user) => {
    cb(err, user);
  });
});

module.exports = passport;
