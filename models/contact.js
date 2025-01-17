
const { Schema, model } = require("mongoose");

const Joi = require("joi");

const contactSchema = Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
  }, {versionKey: false, timestamps: true})

const schemaUpdate = Joi.object({
     name: Joi.string().required(),    
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'ru', 'ua', 'uk'] }
    })
    .pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)
    .required(),
    phone: Joi.string().required(),
     favorite: Joi.boolean()
   }).min(1) 

const Contact = model("contact", contactSchema);

module.exports = {Contact, schemaUpdate};