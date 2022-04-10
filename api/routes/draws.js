const drawController = require('../controllers/draw-controller');

const express = require('express');

const router = express.Router();

router.get('/words/:diff', drawController.getWords);

router.get('/getCanvas', drawController.getCanvas);

router.get('/highScore', drawController.getHs);


module.exports = router;
