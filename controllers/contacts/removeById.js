const { Contact } = require('../../models');
const { NotFound} = require("http-errors");

const removeById = async (req, res, next) => {
   try {
        const {contactId} = req.params;
        const deleteContact = await Contact.findByIdAndRemove(contactId);
        if(!deleteContact){
            throw new NotFound();
        }
        res.json({message: "contact deleted"})
   } catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            error.status = 404;
            error.message = "Not Found"
        }
        next(error);
    }
 
}
module.exports = removeById;