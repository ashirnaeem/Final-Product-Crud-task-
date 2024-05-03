export const contactSchema = {
  FirstName: { label: "First Name", type: "text" },
  LastName: { label: "Last Name", type: "text" },
  Account: { label: "Account", type: "text" },
  Company: { label: "Company", type: "text" },
  PhoneNumber: { label: "Phone Number", type: "text" },
  Email: { label: "Email", type: "email" },
  Country: {
    label: "Country",
    type: "select",
    options: ["Pakistan", "Australia", "New Zealand"],
  },
  Address: { label: "Address", type: "text" },
  ContactType: {
    label: "Contact Type",
    type: "checkboxes",
    options: ["Supplier", "Customer"],
  },

  isEnabled: { label: "Is Enabled", type: "boolean" },
  BusinessInformation: { label: "Business Information", type: "textarea" },
};
