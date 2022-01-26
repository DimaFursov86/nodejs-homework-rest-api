const {Contact} = require('../../models');

const getAll = async (req, res, next) => {
    try {
        
        const { page = 1, limit = 10, favorite } = req.query;
        const {_id} = req.user;
        const skip = (page - 1) * limit;
        const favoriteContacts = favorite ? favorite.includes('true') : undefined;
        const contacts = await Contact.find({owner: _id, favorite: favoriteContacts ?? {$in: [true, false]}}, 
            " ", {skip, limit: +limit});
        res.json(contacts);
    }
    catch(error){
        next(error);
    }

}
module.exports = getAll;