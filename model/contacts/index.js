const fs = require("fs/promises");
const contactsPath = require("./contactsPath")
const updateContacts = require("./updateContacts");
const {v4} = require("uuid");

const listContacts = async () => {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
}

const getContactById = async(id)=> {
    const contacts = await listContacts();
    const result = contacts.find(item => item.id === id);
    if(!result){
        return null;
    }
    return result;
}

const removeContact = async (id) => {
    const contacts = await listContacts();
    const idx = contacts.findIndex(item => item.id === id);
    if (idx === -1) {
        return null;
    }
    const removeContact = contacts.splice(idx, 1);
    await updateContacts(contacts);
    return removeContact;
}
const addContact = async(data)=> {
    const newContact = {...data, id: v4()};
    const contacts = await listContacts();
    contacts.push(newContact);
    await updateContacts(contacts);
    return newContact;
}
const updateContact = async ({id, name, email, phone}) => {
    const contacts = await listContacts();
    const idx = contacts.findIndex(item => item.id === id);
    if(idx === -1){
        return null;
    }
    contacts[idx] = {id, name, email, phone};
    await updateContacts(contacts);
    return contacts[idx];
}
module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};