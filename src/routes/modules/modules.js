const express = require('express');
const router = express.Router();
const Module = require('../../models/module');
const Lecture = require("../../models/lecture");
const Video = require("../../models/video");


//--------------------Get all modules--------------------
//ordenar modulo por orden;
router.get('/', async (req, res) => {
  try {
    const modulos = await Module.find();
    res.json(modulos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//------------------------------------------------------


//-------------------------Get one module-------------------------
router.get('/:id', (req, res) => {
  const { id } = req.params;
  modulo = Module.findById(id).then(modulo => {
    if (!modulo) {
      return res.status(404).json({ message: 'Cannot find module' });
    } else res.json(modulo);
  })
    .catch(
      error => res.status(500).json({ message: error.message })
    );
});
//----------------------------------------------------------------


//--------------------Create one module--------------------
router.post('/', async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const modulo = new Module({
      title,
      description,
      order
    });

    const allModules = await Module.find().then();

    modulo.order = allModules.length === 0 ? 0 : allModules.length;

    const newModule = await modulo.save();
    res.json(newModule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//---------------------------------------------------------


//--------------------Update one module--------------------
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, lectures } = req.body;
  let update = {};
  if (title) {
    update = { ...update, title };
  };
  if (description) {
    update = { ...update, description };
  };
  if (lectures) {
    update = { ...update, lectures };
  };

  Module.findByIdAndUpdate(id, update, { new: true }).then(modulo => {
    res.json(modulo);
  })
    .catch(error => {
      res.status(400).json({ message: error.message });
    });
});

// ------------------------------------------------------------ 


//-------------Delete a module and its entire lectures including its videos-----------
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Lecture.find({ modulo: id }).then(res => {
    for (let i = 0; i < res.length; i++) {
      Video.deleteMany({ lecture: res[i]._id }).then();
    };
  });
  Lecture.deleteMany({ modulo: id }).then();
  Module.findById(id).then(modulo => {
    const allModules = Module.find().then(res => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].order > modulo.order) {
          res[i].order = res[i].order - 1;
          res[i].save();
        }
      }
    });
    modulo.remove();

    res.json(id);
  }).catch(error => {
    res.status(500).json({ message: error.message });
  });
});
// ------------------------------------------------------------ 



module.exports = router;
