const { Contact } = require('../../models');
const { NotFound} = require("http-errors");

const getById = async (req, res, next) => {
  const {contactId} = req.params;
    try {
        const contact = await Contact.findById(contactId);
        if(!contact){
            throw new NotFound("Not Found");
        }
        res.json(contact);
    }
    catch (error) {
        if (error.message.includes("Cast to ObjectId failed")) {
            error.status = 404;
            error.message = "Not Found"
        }
        next(error);
    }
  
}
module.exports = getById;