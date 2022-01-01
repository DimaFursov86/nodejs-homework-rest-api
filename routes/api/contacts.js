const express = require('express')
const router = express.Router()
const {schemaUpdate} = require('../../models/contact');
const {Contact} = require('../../models');
const { NotFound, BadRequest } = require("http-errors");
const {authenticate} = require("../../middlewares");


router.get('/', authenticate, async (req, res, next) => {
  try{
        const contacts = await Contact.find();
        res.json(contacts);
    }
    catch(error){
        next(error);
    }

})

router.get('/:contactId', authenticate, async (req, res, next) => {
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
  
})

router.post('/', authenticate, async (req, res, next) => {
   try {
        const {error} = schemaUpdate.validate(req.body);
        if(error){
            throw new BadRequest("missing required name field");
        }
        const newContact = await Contact.create(req.body);
        res.status(201).json(newContact);
   } catch (error) {
       if (error.message.includes("validation faild")) {
           error.status = 400;
           error.message = "missing required name field"
        }
        next(error);
    }
  
})

router.delete('/:contactId', authenticate, async (req, res, next) => {
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
 
})

router.put('/:contactId', authenticate, async (req, res, next) => {
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
 
})

router.patch('/:contactId/favorite', authenticate, async (req, res, next) => {
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
 
})


module.exports = router
