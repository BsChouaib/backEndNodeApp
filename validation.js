const Joi = require('@hapi/joi');

// Register Validation
const registerValidation = ((body)=>
{
    const schema = Joi.object().keys({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return result = schema.validate(body); 
}
);
// Login Validation

const loginValidation = ((body)=>
{
    const schema = Joi.object().keys({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return result = schema.validate(body); 
}
);
// Creation validation
const creationValidation = ((body)=>
{
    const schema = Joi.object().keys({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required()
    });
    return result = schema.validate(body); 
}
);
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.creationValidation = creationValidation;