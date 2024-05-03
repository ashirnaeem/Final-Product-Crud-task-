import { model,  Schema } from "mongoose";

const ContactSchema = new Schema({
  Account: {
    type: String,
    required: true,
    unique: true,
  },
  Company: {
    type: String,
    required: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  PhoneNumber: {
    type: String,
    required: false,
  },
  Email: {
    type: String,
    required: false,
  },
  ContactType: {
    type: String,
  },
  BusinessInformation: {
    type: String,
    required: false,
  },
  Country: {
    type: String,
    required: false,
  },
  Address: {
    type: String,
    required: false,
  },
  isEnabled: {
    type: Boolean,
    default: false,
  },
});
module.exports = model("Contact", ContactSchema);
