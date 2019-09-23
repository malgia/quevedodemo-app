const express = require('express');
var multer  = require('multer')
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { objectDetect } = require('../utils/object-detect');

const router = express.Router();
const upload = multer().single('screenshot')
const Motorcycle = mongoose.model('Motorcycle');

router.get('/', (req, res) => {
  res.render('form', { title: 'Registration form' });
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
        data: req.body
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

router.get('/motos/:plateid', (req, res) => {
    Motorcycle.find({plateid: req.params.plateid})
      .then((motorcycles) => {
        res.render('index', { title: 'Listado de Motocicletas', motorcycles });
      })
      .catch(() => { res.send('Oops! Hubo un error'); });
});

router.post('/objectDetect', function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res.send({'status': 400, 'message': err});
    } else if (err) {
      res.send({'status': 400, 'message': err});
    }
    res.send({'status': 200, 'message': objectDetect(req.file.buffer) });
  })
});


module.exports = router;
