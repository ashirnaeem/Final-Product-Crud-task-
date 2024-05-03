import  {gql} from "apollo-server";
module.exports = gql`
  type Contact {
    id: ID!
    Account: String!
    Company: String!
    FirstName: String!
    LastName: String!
    PhoneNumber: String
    Email: String
    ContactType: String
    BusinessInformation: String
    Country: String
    Address: String
    isEnabled: Boolean
  }
  input ContactInput {
    id: ID
    Account: String!
    Company: String!
    FirstName: String!
    LastName: String!
    PhoneNumber: String
    Email: String
    ContactType: String
    BusinessInformation: String
    Country: String
    Address: String
    isEnabled: Boolean
  }
  type Query {
    getContacts: [Contact]!
    getContact(id: ID!): Contact
  }
  type Mutation {
    createContact(contact: ContactInput!): Contact!
    updateContact(id: ID!, contact: ContactInput!): Contact!
    deleteContact(id: ID!): Contact!
  }
  type Subscription {
    contactUpdated: Contact!
    newContact: Contact!
  }
`;
