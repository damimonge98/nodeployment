const express = require("express");
const router = express.Router();
const Talk = require("../models/talks");

//get all talks
router.get('/', async (req, res) => {
  try {
    const talks = await Talk.find();
    res.json(talks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get one
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const talk = await Talk.findById(id);
    if (!talk) {
      return res.status(404).json({ message: 'Cannot find talk' });
    } else res.json(talk);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  };
});


//Create One
router.post("/", async (req, res) => {
  const { title, url, imagen, description } = req.body;
  const talk = new Talk({
    title,
    description,
    imagen,
    url
  });

  try {
    const newTalk = await talk.save();
    res.status(201).json(newTalk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

});
// Update One
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, url, imagen, description } = req.body;
  let update;
  if (title) {
    update = { ...update, title };
  }
  if (imagen) {
    update = { ...update, imagen };
  }
  if (description) {
    update = { ...update, description };
  }
  if (url) {
    update = { ...update, url };
  }

  try {
    const talk = await Talk.findByIdAndUpdate(id, update, { new: true });
    res.json(talk);

  }
  catch (error) {
    res.status(400).json({ message: error.message });
  };
});
//Delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const talk = await Talk.findById(id);
    talk.remove();
    res.json(id);

  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
