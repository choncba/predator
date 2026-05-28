'use strict';
const consts = require('../../common/consts');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let artilleryValidate;
try {
    const artillerySchema = require('artillery/core/lib/schemas/artillery_test_script');
    artilleryValidate = ajv.compile(artillerySchema);
} catch (err) {
    // If the schema cannot be loaded, validation will be skipped
    artilleryValidate = null;
}

module.exports = {
    verifyArtillery
};

function verifyArtillery(req, res, next) {
    const body = req.body;
    if (body.type === consts.TEST_TYPE_BASIC) {
        if (!artilleryValidate) {
            return next();
        }
        const valid = artilleryValidate(body.artillery_test);
        if (!valid) {
            const errorMessages = artilleryValidate.errors.map(err => `${err.instancePath} ${err.message}`).join(', ');
            const error = new Error('The artillery json is not valid. Errors: ' + errorMessages);
            error.statusCode = 400;
            return next(error);
        }
    }

    next();
}
