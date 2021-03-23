require("dotenv").config();
const { DATABASE_URL, SECRET } = process.env;
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");

// Models
const Module = require("./src/models/module");
const Lecture = require("./src/models/lecture");
const User = require("./src/models/user");

// Data
const modules = require('./data');

const userRoutes = require('./src/routes/users');
const authRoutes = require('./src/routes/auth/auth');
const lectureRoutes = require('./src/routes/lectures');
const uploadRoutes = require('./src/routes/upload/upload');
const { mailRoutes } = require('./src/routes/mail.js');
const videoRoutes = require('./src/routes/videos');
const modulesRoutes = require('./src/routes/modules/modules');
const empleoRoutes = require('./src/routes/empleos');
const talkRoutes = require('./src/routes/talk');
const booms = require('./src/routes/booms.js');
const boomTweets = require('./src/routes/boomTweets.js');
const readme = require("./src/routes/readme.js");
const enterprise = require('./src/routes/enterprise.js');

const server = express();

mongoose.Promise = global.Promise;
mongoose.connect(DATABASE_URL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', async () => {
  //db.dropDatabase(); // Borra por completo la base de datos
  db.dropCollection("modules"); //Borra solo los modulos 
  db.dropCollection("lectures");// Borra solo las lectures
  try {
    await Promise.all(
      modules.map(async m => {
        let lectures = m.lectures;
        delete m.lectures;
        const module = await Module.create(m);

        await Promise.all(
          lectures.map(async l => {
            const lecture = await Lecture.create({ ...l, modulo: module._id });
            return lecture;
          })
        );
        return module;
      })
    );
  } catch (err) {
    console.log(err);
  }

  console.log('  🗃  Connected to database!\n  👨‍💻  Have fun! 👩‍💻');
});

// Middleware
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(cors({
  origin: 'http://localhost:3000', // Client
  credentials: true
}));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Authorization, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS');
  next();
});

server.use(passport.initialize());
require("./src/passport");

server.all("*", (req, res, next) => {
  passport.authenticate("bearer", (err, user) => {
    if (err) return res.status(401).json({ msg: "You are not logged in." });
    if (user) {
      req.user = user;
    }
    return next();
  })(req, res, next);
});

// Routes
server.use('/auth', authRoutes);
server.use('/users', userRoutes);
server.use('/lectures', lectureRoutes);
server.use("/upload", uploadRoutes);
server.use("/videos", videoRoutes);
server.use("/modules", modulesRoutes);
server.use("/boom", booms);
server.use("/boomTweets", boomTweets);
server.use("/sendMail", mailRoutes);
server.use('/empleos', empleoRoutes);
server.use('/talk', talkRoutes);
server.use("/readme", readme);
server.use("/enterprise", enterprise);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 5000;

server.listen(port,host, () => {
  console.log("  🚀 Server running on port", port);
});
