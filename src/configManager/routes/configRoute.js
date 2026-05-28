'use strict';

const express = require('express');
const swaggerValidator = require('openapi-validator-middleware');
const config = require('../controllers/configController');
const router = express.Router();
const validators = require('../helpers/validators');

router.put('/', swaggerValidator.validate, validators.validateBenchmarkWeights, config.updateConfig);
router.delete('/:key', config.deleteConfig);
router.get('/', config.getConfig);
module.exports = router;