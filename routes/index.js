const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const scanQR = require('../scanQR');

const router = express.Router();
const Motorcycle = mongoose.model('Motorcycle');

router.get('/', (req, res) => {
  res.render('form', { title: 'Registration form', scanQR: scanQR });
});

router.post('/',
  // [
  //   check('plateid').isLength({ min: 6 }).withMessage('Ingrese una placa valida'),
  //   check('name').isLength({ min: 1 }).withMessage('Ingrese el nombre'),
  //   check('passengers').isLength({ min: 1 }).withMessage('Ingrese el totaal de pasajeros permitidos'),
  // ]
  (req, res) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const motorcycle = new Motorcycle(req.body);
        motorcycle.save()
          .then(() => { res.send('Gracias por registrar su moto!'); })
          .catch(() => { res.send('Oops.. Hubo un problema.'); });
    } else {
      res.render('form', {
        title: 'Registro de Motocicletas',
        errors: errors.array(),
        data: req.body,
        scanQR: scanQR
      });
    }
});

router.get('/motos', (req, res) => {
    Motorcycle.find()
      .then((motorcycles) => {
        res.render('index', { title: 'Listado de Motocicletas', motorcycles });
      })
      .catch(() => { res.send('Oops! Hubo un error'); });
});

module.exports = router;
