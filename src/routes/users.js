const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Module = require('../models/module');
const { isSuperAdmin, isUser } = require('../middlewares/auth');

// Get all users
router.get('/', async (req, res, next) => {
  // isSuperAdmin(req, res, next);
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Get users by role
router.get('/:role', (req, res) => {
  const { role } = req.params;
  User.find({ role })
    .then(users => res.json(users))
    .catch(
      error => res.status(500).json({ message: error.message })
    );
});

// Get all Instructors
router.get('/instructors', async (req, res) => {
  try {
    const users = await User.find({ role: "instructor" });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all students
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.json(students);
  }
  catch (error) {
    res.status(500).json({ message: error });
  }
});


// Get one user
router.get('/user/:id', (req, res) => {
  const { id } = req.params;

  User.findById(id).then(user => {
    if (!user || user.removed) {
      return res.status(404).json({ message: 'Cannot find user' });
    } else res.json(user);
  })
    .catch(
      error => res.status(500).json({ message: error.message })
    );
});

// Create one user
router.post('/', async (req, res) => {

  const {
    firstName,
    lastName,
    companyName,
    email,
    password,
    role,
    currentModule,
    avatar,
    debt,
    verifiedCompany,
    jobs,
    isSuperAdmin,
    removed
  } = req.body;
  const user = new User({
    firstName,
    lastName,
    companyName,
    email,
    password,
    role,
    currentModule,
    avatar,
    debt,
    verifiedCompany,
    jobs,
    isSuperAdmin,
    removed
  });
  if (user.isSuperAdmin === true || user.role === 'instructor') {
    const allModules = await Module.find().then();
    user.currentModule = allModules.length;
    user.debt = null;

  };

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update one user
router.patch('/user/:id', async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    companyName,
    email,
    password,
    role,
    currentModule,
    avatar,
    debt,
    verifiedCompany,
    jobs,
    isSuperAdmin,
    removed
  } = req.body;
  let allModules = await Module.find();
  let current = allModules.length;
  let update = req.body;


  if (typeof isSuperAdmin === "boolean" && isSuperAdmin === true) {
    update = { ...update, isSuperAdmin, currentModule: current, debt: null };
  };

  if (typeof isSuperAdmin === "boolean" && isSuperAdmin === false) {
    update = { ...update, isSuperAdmin, currentModule };
  };

  if (role && role === "instructor") {
    update = { ...update, currentModule: current };
  };
  if (role) {
    update = { ...update, role };
  };
  if (currentModule && currentModule == 3 || currentModule == 4) {
    update = { ...update, currentModule, debt: 500 };
  };
  if (currentModule && currentModule > 4) {
    update = { ...update, currentModule, debt: 4000 };
  };

  if (debt && debt == 0) {
    update = { ...update, debt: 0 };
  };

  User.findByIdAndUpdate(id, update, { new: true }).then(user => {
    res.json(user);
  })
    .catch(error => {
      res.status(400).json({ message: error.message });
    });
});

//Ban one user
router.patch('/ban/:id', (req, res) => {
  const { id } = req.params;
  User.findOneAndUpdate(id, { role: 'banned' }, { new: true }).then(user => {
    res.json(user);
  })
    .catch(error => {
      res.status(400).json({ message: error.message });
    });
});

// Delete one user
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  User.findById(id).then(user => {
    user.remove();
    res.json(id);
  }).catch(error => {
    res.status(500).json({ message: error.message });
  });
});




module.exports = router;
