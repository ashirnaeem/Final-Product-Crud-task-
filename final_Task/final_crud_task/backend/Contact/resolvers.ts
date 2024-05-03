const Contact = require("./contactModel");
const { PubSub } = require("graphql-subscriptions");

const contact_created = "NEW_CONTACT_CREATED";
const contact_updated = "CONTACT_UPDATED";
const pubsub = new PubSub();

const publishNewContactAdded = (contact:any) => {
  pubsub.publish(contact_created, { newContact: contact });
};

const publishContactUpdated = (contact:any) => {
  pubsub.publish(contact_updated, { contactUpdated: contact });
};

module.exports = {
  Query: {
    getContacts: async () => {
      return await Contact.find();
    },
    getContact: async (_:any, { id }:any) => {
      return await Contact.findById(id);
    },
  },
  Mutation: {
    createContact: async (_:any, { contact }:any) => {
      const newContact = new Contact(contact);
      await newContact.save();
      publishNewContactAdded(newContact);
      return newContact;
    },
    updateContact: async (_:any, { id, contact }:any) => {
      const updatedContact = await Contact.findByIdAndUpdate(id, contact, {
        new: true,
      });
      publishContactUpdated(updatedContact);
      return updatedContact;
    },
    deleteContact: async (_:any, { id }:any) => {
      const deletedContact = await Contact.findByIdAndDelete(id);
      return deletedContact;
    },
  },
  Subscription: {
    newContact: {
      subscribe: () => pubsub.asyncIterator([contact_created]),
    },
    contactUpdated: {
      subscribe: () => pubsub.asyncIterator([contact_updated]),
    },
  },
};
