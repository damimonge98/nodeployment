const express = require('express');
const router = express.Router();
const Empresa = require('../models/enterprise');
const Empleo = require("../models/empleos");

//Get all enterprise
router.get('/', async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get one enterprise
router.get('/:id', (req, res) => {
  const { id } = req.params;
  empresa = Empresa.findById(id).then(empresa => {
    if (!empresa) {
      return res.status(404).json({ message: 'Cannot find enterprise' });
    } else res.json(empresa);
  })
    .catch(
      error => res.status(500).json({ message: error.message })
    );
});

//Create one enterprise
router.post('/', async (req, res) => {
  const { name, logo, password, email } = req.body;
  const empresa = new Empresa({
    name,
    logo,
    password,
    email
  });

  try {
    const newEmpresa = await empresa.save();
    res.json(newEmpresa);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Update one enterprise
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { name, logo, password, email } = req.body;

  Empresa.findByIdAndUpdate(id, req.body, { new: true }).then(empresa => {
    res.json(empresa);
  })
    .catch(error => {
      res.status(400).json({ message: error.message });
    });
});

//Delete one enterprise
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  Empresa.findById(id).then(empresa => {
    empresa.remove();

    res.json(id);
  }).catch(error => {
    res.status(500).json({ message: error.message });
  });
});

module.exports = router;