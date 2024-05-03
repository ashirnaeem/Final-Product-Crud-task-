import { gql } from "@apollo/client";

export const GET_CONTACTS = gql`
  query GetContacts {
    getContacts {
      id
      Account
      Company
      FirstName
      LastName
      PhoneNumber
      Email
      ContactType
      BusinessInformation
      Country
      Address
      isEnabled
    }
  }
`;

export const GET_CONTACT = gql`
  query GetContact($id: ID!) {
    getContact(id: $id) {
      id
      Account
      Company
      FirstName
      LastName
      PhoneNumber
      Email
      ContactType
      BusinessInformation
      Country
      Address
      isEnabled
    }
  }
`;

export const CREATE_CONTACT = gql`
  mutation CreateContact($contact: ContactInput!) {
    createContact(contact: $contact) {
      id
      Account
      Company
      FirstName
      LastName
      PhoneNumber
      Email
      ContactType
      BusinessInformation
      Country
      Address
      isEnabled
    }
  }
`;

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $contact: ContactInput!) {
    updateContact(id: $id, contact: $contact) {
      id
      Account
      Company
      FirstName
      LastName
      PhoneNumber
      Email
      ContactType
      BusinessInformation
      Country
      Address
      isEnabled
    }
  }
`;

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      id
      Account
      Company
      FirstName
      LastName
      PhoneNumber
      Email
      ContactType
      BusinessInformation
      Country
      Address
    }
  }
`;

export const CONTACT_SUBSCRIPTION = gql`
  subscription NewContact {
    newContact {
      id
      Account
      Company
      FirstName
      LastName
      PhoneNumber
      Email
      ContactType
      BusinessInformation
      Country
      Address
    }
  }
`;

export const CONTACT_UPDATED_SUBSCRIPTION = gql`
  subscription ContactUpdated {
    contactUpdated {
      id
      Account
      Company
      FirstName
      LastName
      PhoneNumber
      Email
      ContactType
      BusinessInformation
      Country
      Address
    }
  }
`;
