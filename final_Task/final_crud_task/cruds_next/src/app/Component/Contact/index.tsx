import { useMutation, useSubscription } from "@apollo/client";
import {
  CREATE_CONTACT,
  UPDATE_CONTACT,
  DELETE_CONTACT,
  CONTACT_SUBSCRIPTION,
  CONTACT_UPDATED_SUBSCRIPTION,
} from "../../../../Graphql/queries";

export const useContactMutations = () => {
  const [createContactMutation] = useMutation(CREATE_CONTACT);
  const [updateContactMutation] = useMutation(UPDATE_CONTACT);
  const [deleteContactMutation] = useMutation(DELETE_CONTACT);

  useSubscription(CONTACT_SUBSCRIPTION, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData?.data?.newContact) {
        const newContact = subscriptionData.data.newContact;
        client.cache.modify({
          fields: {
            getContacts(existingContacts = []) {
              return [...existingContacts, newContact];
            },
          },
        });
      }
    },
  });

  useSubscription(CONTACT_UPDATED_SUBSCRIPTION, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      if (subscriptionData?.data?.contactUpdated) {
        const updatedContact = subscriptionData.data.contactUpdated;
        client.cache.modify({
          fields: {
            getContacts(existingContacts = []) {
              return existingContacts?.map((contact: { id: any }) =>
                contact.id === updatedContact.id ? updatedContact : contact
              );
            },
          },
        });
      }
    },
  });

  const createContact = async (contactData: { [x: string]: any[] }) => {
    try {
      const contactType = contactData["ContactType"].join(", ");
      await createContactMutation({
        variables: {
          contact: { ...contactData, ContactType: contactType },
        },
      });
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const updateContact = async (id: any, contactData: any) => {
    try {
      let contactType = contactData["ContactType"];
      if (Array.isArray(contactType)) {
        contactType = contactType.join(", ");
      }
      const { __typename, ...contactWithoutTypename } = contactData;
      await updateContactMutation({
        variables: {
          id: id,
          contact: { ...contactWithoutTypename, ContactType: contactType },
        },
      });
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  const deleteContact = async (id: any) => {
    try {
      await deleteContactMutation({
        variables: {
          id: id,
        },
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  return { createContact, updateContact, deleteContact };
};
