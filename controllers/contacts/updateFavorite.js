const { Contact } = require('../../models');
const { BadRequest } = require("http-errors");


const updateFavorite = async (req, res, next) => {
   try {
        
       const { contactId } = req.params;
       const {favorite} = req.body
       const updateStatusContact = await Contact.findByIdAndUpdate(contactId, { favorite }, { new: true });
       
        if(favorite === undefined){
            throw new BadRequest("missing field favorite");
        }
        res.json(updateStatusContact);
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
module.exports = updateFavorite;