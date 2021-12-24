const express = require('express')
const router = express.Router()
const {schemaUpdate} = require('../../models/contact');
const {Contact} = require('../../models');
const {NotFound, BadRequest} = require("http-errors");
// const Joi = require("joi");

// const schemaUpdate = Joi.object({
//      name: Joi.string().required(),    
//   email: Joi.string()
//     .email({
//       minDomainSegments: 2,
//       tlds: { allow: ['com', 'net', 'org', 'ru', 'ua'] }
//     })
//     .pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)
//     .required(),
//      phone: Joi.string().required()
//    }).min(1) 

router.get('/', async (req, res, next) => {
  try{
        const contacts = await Contact.find();
        res.json(contacts);
    }
    catch(error){
        next(error);
    }

})

router.get('/:contactId', async (req, res, next) => {
  const {contactId} = req.params;
    try {
        const contact = await contactsOperations.getContactById(contactId);
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
        const newContact = await Contact.create(req.body);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
  
})

router.delete('/:contactId', async (req, res, next) => {
   try {
        const {contactId} = req.params;
        const deleteContact = await contactsOperations.removeContact(contactId);
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
        const updateContact = await contactsOperations.updateContact({id: contactId, ...req.body});
        if(!updateContact){
            throw new NotFound();
        }
        res.json(updateContact);
    } catch (error) {
        next(error);
    }
 
})

module.exports = router
