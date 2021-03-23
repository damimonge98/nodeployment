const express = require('express');
const { findById } = require('../models/lecture');
const lecture = require('../models/lecture');
const router = express.Router();
const Lecture = require('../models/lecture');
const Module = require('../models/module');
const Video = require('../models/video');

// get all lectures of a specific module
router.get('/', async (req, res) => {
  const q = {};
  if (req.query.moduleid !== undefined) {
    q.modulo = req.query.moduleid;
  };
  try {
    const lectures = await Lecture.find(q);
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

});

// Get one lecture
router.get('/:id', (req, res) => {
  const { id } = req.params;
  Lecture.findById(id).then(lecture => {
    if (!lecture) {
      return res.status(404).json({ message: 'Cannot find lecture' });
    } else res.json(lecture);
  })
    .catch(
      error => res.status(500).json({ message: error.message })
    );
});

// Create one lecture for one module;
router.post('/:_id', async (req, res) => {
  const { title, imagen, description, moduloName, urlLecture } = req.body;
  const lectureForModule = new Lecture({
    title,
    imagen,
    description,
    moduloName,
    urlLecture
  });

  const module = await Module.findById(req.params._id);
  lectureForModule.modulo = req.params._id;
  await lectureForModule.save();
  module.lectures.push(lectureForModule);
  await module.save();
  res.send(lectureForModule);
});


// Update one lecture
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, video, modulo, imagen, moduloName, urlLecture } = req.body;
  let update = {};
  if (title) {
    update = { ...update, title };
  };
  if (description) {
    update = { ...update, description };
  };
  if (video) {
    update = { ...update, video };
  };
  if (modulo) {
    update = { ...update, modulo };
  };
  if (imagen) {
    update = { ...update, imagen };
  };
  if (moduloName) {
    update = { ...update, moduloName };
  };
  if (urlLecture) {
    update = { ...update, urlLecture };
  };

  Lecture.findByIdAndUpdate(id, update, { new: true }).then(lecture => {
    res.json(lecture);
  })
    .catch(error => {
      res.status(400).json({ message: error.message });
    });
});

// Delete a lecture, delete it from the module and all its videos.
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Video.deleteMany({ lecture: id }).then();   //elimina videos de la lecture
  Module.find({ lectures: id }).then(res => { //elimina la lecture dentro modulo
    for (let i = 0; i < res[0].lectures.length; i++) {
      if (res[0].lectures[i] == id) {
        res[0].lectures.splice(i, 1);
      };
    };
    res[0].save();
  });
  Lecture.findById(id).then(lecture => {
    lecture.remove();
    res.json(id);
  }).catch(error => {
    res.status(500).json({ message: error.message });
  });
});

module.exports = router;
