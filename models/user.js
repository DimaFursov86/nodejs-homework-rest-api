const {Schema, model} = require("mongoose");
const Joi = require("joi");
// const bcrypt = require("bcryptjs");

const emailRegexp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

const userSchema = Schema({
  password: {
    type: String,
    minlength: 6,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    match: emailRegexp,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  }
   
}, {versionKey: false, timestamps: true});

const joiSignupSchema = Joi.object({
    email: Joi.string()
        .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'ru', 'ua', 'uk'] }
    })
        .pattern(emailRegexp),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valueOf("starter", "pro", "business")
    
});

const joiLoginSchema = Joi.object({
    email: Joi.string()
        .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'org', 'ru', 'ua', 'uk'] }
    })
        .pattern(emailRegexp),
    password: Joi.string().min(6).required()
});

const User = model("user", userSchema);

module.exports = {
    User,
    joiSignupSchema,
    joiLoginSchema
}