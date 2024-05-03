import * as Yup from "yup";

const yupProductSchema = Yup.object().shape({
  Name: Yup.string()
    .matches(/^[a-zA-Z\s]*$/, "ItemName can only contain alphabets")

    .min(2, "Item Name must be at least 2 characters long")
    .max(20, "Item Name can be 20 characters long")
    .required("Item Name* is required")
    .test({
      name: "no-floating-point",
      test: (value) => !/^\d+\.\d+$/.test(value),
      message: "Name cannot contain floating point numbers",
    }),
  Code: Yup.string()
    .matches(
      /^[a-zA-Z0-9\s]*$/,
      "ItemCode must contain only alphabets or integers"
    )
    .min(2, "Item Code must be at least 2 characters or integers  long")
    .max(20, "Item Code must be 20 characters long")
    .required("Item Code* is required")
    .test({
      name: "no-floating-point",
      test: (value) => !/^\d+\.\d+$/.test(value),
      message: "Code cannot contain floating point numbers",
    }),
  Unit: Yup.mixed().required("Unit is required"),

  Weight: Yup.number()
    .typeError("Weight is required")
    .required("Weight is required"),
});

export default yupProductSchema;
