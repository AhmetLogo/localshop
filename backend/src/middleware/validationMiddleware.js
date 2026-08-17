const { sendError } = require("../utils/apiResponse");

/**
 * Runs a validator function against req.body/req.query and rejects with 400
 * before the request reaches authentication/authorization or the controller.
 */
function validate(validator) {
  return function validationHandler(req, res, next) {
    const errors = validator(req);

    if (errors && errors.length > 0) {
      return sendError(res, 400, errors.join(", "));
    }

    next();
  };
}

module.exports = { validate };
