const { Contact } = require('../../models');
const { BadRequest, NotFound } = require("http-errors");
const {schemaUpdate} = require('../../models/contact');

const updateById = async (req, res, next) => {
   try {
         const {error} = schemaUpdate.validate(req.body);
        if(error){
            throw new BadRequest("validation faild");
        }
        const {contactId} = req.params;
        const updateContact = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
        if(!updateContact){
            throw new NotFound();
        }
        res.json(updateContact);
   } catch (error) {
       if (error.message.includes("validation faild")) {
            error.status = 400;
       }
        if (error.message.includes("Cast to ObjectId failed")) {
            error.status = 404;
            error.message = "Not Found"
        }
        next(error);
    }
 
}
module.exports = updateById;