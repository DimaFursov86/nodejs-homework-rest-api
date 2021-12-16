const express = require('express')
const router = express.Router()
const contactsOperations = require('../../model/contacts');
const {NotFound, BadRequest} = require("http-errors");
const Joi = require("joi");

const schemaUpdate = Joi.object({
     name: Joi.string(),    
     email: Joi.string(),
     phone: Joi.string()
   }).min(1) 

router.get('/', async (req, res, next) => {
  try{
        const contacts = await contactsOperations.listContacts();
        res.json(contacts);
    }
    catch(error){
        next(error);
    }

})

router.get('/:contactId', async (req, res, next) => {
  const {id} = req.params;
    try {
        const contact = await contactsOperations.getContactById(id);
        if(!contact){
            throw new NotFound();
        }
        res.json(contact);
    }
    catch(error){
        next(error);
    }
  
})

router.post('/', async (req, res, next) => {
   try {
        const {error} = schemaUpdate.validate(req.body);
        if(error){
            throw new BadRequest("missing required name field");
        }
        const newContact = await contactsOperations.addContact(req.body);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
  
})

router.delete('/:contactId', async (req, res, next) => {
   try {
        const {id} = req.params;
        const deleteContact = await contactsOperations.removeContact(id);
        if(!deleteContact){
            throw new NotFound();
        }
        res.json({message: "contact deleted"})
    } catch (error) {
        next(error);
    }
 
})

router.put('/:contactId', async (req, res, next) => {
   try {
        const {error} = schemaUpdate.validate(req.body);
        if(error){
            throw new BadRequest("missing fields");
        }
        const {contactId} = req.params;
        const updateContact = await contactsOperations.updateContact({contactId, ...req.body});
        if(!updateContact){
            throw new NotFound();
        }
        res.json(updateContact);
    } catch (error) {
        next(error);
    }
 
})

module.exports = router
