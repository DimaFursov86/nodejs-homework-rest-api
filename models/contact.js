
const { Schema, model } = require("mongoose");

const Joi = require("joi");

const contactSchema = Schema({
    name: {
        type: String,
        require: true,
        minlength: 2
    },   
    email: {
         type: String,
        require: true,
        unique: true
     },
     phone: {
         type: String,
         require: true,
        unique: true
     },
})

const schemaUpdate = Joi.object({
     name: Joi.string().required(),    
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'ru', 'ua'] }
    })
    .pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)
    .required(),
     phone: Joi.string().required()
   }).min(1) 

const Contact = model("contact", contactSchema);

module.export = {Contact, schemaUpdate};