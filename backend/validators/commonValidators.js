const { param } = require('express-validator');

const mongoIdParamValidator = (paramNames = ['id']) => {
    return paramNames.map((name) =>
        param(name).isMongoId().withMessage(`Invalid ${name} format`)
    );
};

module.exports = {
    mongoIdParamValidator,
};
