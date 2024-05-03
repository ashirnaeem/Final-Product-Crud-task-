import { Schema, model, Error } from "mongoose";

// Custom validation function to check valid unit values
const validateUnit = (value: any) => {
  const allowedUnits = ["kilo", "Number", "Tonne", "M3"];
  // If it's an array, validate each value individually
  if (Array.isArray(value)) {
    for (const unit of value) {
      if (!allowedUnits.includes(unit)) {
        return false; // Validation failed
      }
    }
  } else {
    // If it's a single value, validate it directly
    if (!allowedUnits.includes(value)) {
      return false; // Validation failed
      
      
    }
  }
  return true; // Validation passed
};

// Custom validation function to check if only alphabets are present
const validateAlphabets = async (value: any) => {
  // Check if only alphabets are present
  if (!/^[a-zA-Z\s]+$/.test(value)) {
    throw new Error("Only alphabets are allowed for the name field");
  }
  
  // Check if length is between 2 and 20
  if (value.length < 2 || value.length > 20) {
    throw new Error("Name must be between 2 and 20 alphabets long");
  }

  // Check if the name already exists
  const existingProduct = await Products.findOne({ Name: value });
  if (existingProduct) {
    throw new Error(`Name "${value}" already exists`);
  }
};

// Custom validation function to check if only alphabets or integers are present
const validateCode = async (value: any) => {
  // Check if only alphabets or integers are present
  if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
    throw new Error("Only alphabets or integers are allowed for the code field");
  }
  
  // Check if length is between 2 and 20
  if (value.length < 2 || value.length > 20) {
    throw new Error("Code must be between 2 and 20 alphabets or integers long");
  }

  // Check if the code already exists
  const existingProduct = await Products.findOne({ Code: value });
  if (existingProduct) {
    throw new Error(`Code "${value}" already exists`);
  }
};

// Custom validation function to check if the value is a positive number
const validatePositiveNumber = (value: any) => {

  if (isNaN(value) || parseFloat(value) <= 0) {
    throw new Error("Weight is required");
  }
};

// Pre-save hook to trim and reduce multiple spaces to single space
const reduceSpaces = (value: any) => {
  return value.replace(/\s+/g, ' ').trim();
};

const UserSchema = new Schema({
  Name: {
    type: String,
    required: true,
    unique: true,
    validate: [validateAlphabets, "Only alphabets are allowed for the name field"],
    set: reduceSpaces // Apply pre-save hook to the Name field
  },
  Code: {
    type: String,
    required: true,
    unique: true,
    validate: [validateCode, "Only alphabets or integers are allowed for the code field"],
    set: reduceSpaces // Apply pre-save hook to the Code field
  },
  Image: {
    type: String,
    required: false
  },
  Unit: {
    type: [String],
    required: true,
    validate: [validateUnit, "Unit is required with kilo Number Tonne M3"]
  },
  Size: {
    type: [String],
    required: false,
  
  },
  Weight: {
    type: Number,
    required: true,
    validate: [validatePositiveNumber, "Weight is required and positive number"]
  },
  Length: {
    type: Number,
    required: false
  },
  Width: {
    type: Number,
    required: false
  },
  Height: {
    type: Number,
    required: false
  },
  CubicMeasurement: {
    type: String,
    required: false
  },
  Colors: {
    type: String
  },
  Description: {
    type: String,
    required: false
  },
  isEnabled: {
    type: Boolean,
    required: false
  }
});

const Products = model("Products", UserSchema);
export default Products;
