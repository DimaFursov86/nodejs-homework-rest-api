const { Contact} = require('../../models');
const { BadRequest } = require("http-errors");
const {schemaUpdate} = require('../../models/contact');

const add = async (req, res, next) => {
   try {
        const {error} = schemaUpdate.validate(req.body);
        if(error){
            throw new BadRequest("missing required name field");
       }
       const {_id} = req.user;
        const newContact = await Contact.create({...req.body, owner: _id});
        res.status(201).json(newContact);
   } catch (error) {
       if (error.message.includes("validation faild")) {
           error.status = 400;
           error.message = "missing required name field"
        }
        next(error);
    }
  
}
module.exports = add;