const express = require("express");
const router = express.Router();

//----------Modelos----------

const Empleo = require("../models/empleos");
const User = require('../models/user');

//----------Rutas----------

//-----Crear un empleo
router.post("/:id", async (req, res) => {
  const {
    logo,
    companyName,
    title,
    description,
    remote,
    location,
    tipo,
    end,
    linkedIn,
    enterprise
  } = req.body;
  const { id } = req.params;
  const offerCard = new Empleo({
    logo,
    companyName,
    title,
    description,
    remote,
    location,
    tipo,
    end,
    linkedIn,
    enterprise

  });
  const oneEnterprise = await User.findById(id);
  offerCard.enterprise = req.params.id;
  await offerCard.save();
  oneEnterprise.jobs.push(offerCard);
  await oneEnterprise.save();
  try {
    res.status(201).json(offerCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//--------------------

//-----Traer un empleo
router.get("/:id", (req, res) => {
  const { id } = req.params;
  empleo = Empleo.findById(id)
    .then((empleo) => {
      if (!empleo) {
        return res
          .status(404)
          .json({ message: "El empleo solicitado no existe" });
      } else res.json(empleo);
    })
    .catch((error) => res.status(500).json({ message: error.message }));
});
//--------------------

//-----Traer todos los empleos
router.get("/", async (req, res) => {
  try {
    const empleos = await Empleo.find();
    res.json(empleos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//----------------------------

//-----Eliminar empleo
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  User.find({ jobs: id }).then(res => {
    for (let i = 0; i < res[0].jobs.length; i++) {
      if (res[0].jobs[i] == id) {
        res[0].jobs.splice(i, 1);
        res[0].save();
      };
    };
  });
  Empleo.findById(id)
    .then((empleo) => {
      empleo.remove();
      res.json({ message: "Oferta eliminada exitosamente" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});
//--------------------

//-----Editar un empleo
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const {
    companyName,
    logo,
    title,
    description,
    remote,
    location,
    tipo,
    end,
    linkedIn,
  } = req.body;

  Empleo.findByIdAndUpdate(id, req.body, { new: true })
    .then((empleo) => {
      res.json(empleo);
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});
//---------------------

module.exports = router;
