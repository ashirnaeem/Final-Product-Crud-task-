import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Switch,
  Box,
  Radio,
  MenuItem,
  Typography,
  Modal,
  Paper,
} from "@mui/material";
import { GET_PRODUCT_SIZE, GET_PRODUCT } from "../Product/productQueries";
import UploadForm from "./s3Form";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import SideBar from "./Sidebar/index";
import YupValidation from "./yupValidation";
import { ProductSchema } from "../Product/schema";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useProductMutations from "../Product/productMutation";
import { useQuery } from "@apollo/client";
interface EditDataForProductSize {
  id: string;
}

interface ProductSize {
  _id: string;
  Size: string;
  ProductSizes: string;
}
interface SchemaField {
  label: string;
  type: string;
  options?: string[];
}
interface IForm {
  editData: any;
  handleCloseData?: () => void;
  handleCloseForm?: () => void;
  onSnackbarOpen: () => void;
}
interface Schema {
  [key: string]: SchemaField;
}
const MyForm: React.FC<IForm> = ({
  editData,
  handleCloseData,
  handleCloseForm,
  onSnackbarOpen,
}: any) => {
  const [formData, setFormData] = useState<any>(editData || {});
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [selectedSchema, setSelectedSchema] = useState<Schema>(ProductSchema);
  const { refetch } = useQuery(GET_PRODUCT);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const { createProduct, updateProduct, createProductSize, UpdateProductSize } =
    useProductMutations();
  const [editDataForProductSize, seteditDataForProductSize] =
    useState<EditDataForProductSize | null>(null);
  const [open, setOpen] = useState<boolean | undefined>(false);
  const [unitValue, setUnitValue] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [displaySize, setDisplaySize] = useState(false);
  const [manageSize, setManageSize] = useState<ProductSize[]>([]);
  const [currentFieldName, setCurrentFieldName] = useState<string>("");
  const {
    data: productData,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCT);

  const {
    data,
    loading,
    error,
    refetch: refetchProductSize,
  } = useQuery(GET_PRODUCT_SIZE);
  useEffect(() => {
    if (data) {
      setManageSize(data);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const existingProducts = productData.Products || [];

  // const handleFieldChange = (
  //   fieldName: string,
  //   value: string | boolean | number
  // ) => {
  //   console.log("object", value);
  //   if (fieldName === "Name") {
  //     // Validation for the "Name" field
  //     const trimmedValue = value.trim();
  //     const containsOnlyAlphabetsAndSingleSpace = /^[a-zA-Z\s]*$/.test(
  //       trimmedValue
  //     );

  //     if (!containsOnlyAlphabetsAndSingleSpace) {
  //       setFieldErrors({
  //         ...fieldErrors,
  //         [fieldName]: "Only alphabets and spaces are allowed",
  //       });
  //     } else if (trimmedValue.length < 2) {
  //       setFieldErrors({
  //         ...fieldErrors,
  //         [fieldName]: "",
  //       });
  //     } else if (trimmedValue.length > 20) {
  //       setFieldErrors({
  //         ...fieldErrors,
  //         [fieldName]: "",
  //       });
  //     } else {
  //       setFieldErrors({
  //         ...fieldErrors,
  //         [fieldName]: "",
  //       });
  //     }

  //     // Prevent updating formData if trimmedValue exceeds 20 characters
  //     if (trimmedValue.length <= 20) {
  //       setFormData({ ...formData, [fieldName]: trimmedValue });
  //     }
  //   } else if (fieldName === "Code") {
  //     // Validation for the "Code" field
  //     const trimmedValue = value.trim();
  //     const isValidLength =
  //       trimmedValue.length >= 2 && trimmedValue.length <= 20;
  //     const containsOnlyAlphaNumeric = /^[a-zA-Z0-9\s]*$/.test(trimmedValue);

  //     if (!isValidLength) {
  //       setFieldErrors({
  //         ...fieldErrors,
  //         [fieldName]: "",
  //       });
  //     } else if (!containsOnlyAlphaNumeric) {
  //       setFieldErrors({
  //         ...fieldErrors,
  //         [fieldName]: "Only alphabets and integers are allowed",
  //       });
  //     } else {
  //       setFieldErrors({
  //         ...fieldErrors,
  //         [fieldName]: "",
  //       });
  //     }

  //     if (trimmedValue.length <= 20) {
  //       setFormData({ ...formData, [fieldName]: trimmedValue });
  //     }
  //   }

  // if (
  //   fieldName === "Length" ||
  //   fieldName === "Width" ||
  //   fieldName === "Height"
  // ) {
  //   setFormData((prevState: any) => {
  //     const updatedFormData = { ...prevState, [fieldName]: value };

  //     // Check if all three fields have values entered
  //     const length = parseFloat(updatedFormData["Length"] || "");
  //     const width = parseFloat(updatedFormData["Width"] || "");
  //     const height = parseFloat(updatedFormData["Height"] || "");

  //     if (!isNaN(length) && !isNaN(width) && !isNaN(height)) {
  //       // Calculate cubic measurement (length * width * height)
  //       const cubicMeasurement = (length * width * height).toFixed(2); // Round to six decimal places
  //       return { ...updatedFormData, CubicMeasurement: cubicMeasurement };
  //     } else {
  //       // If any of the fields is empty or not a number, clear the cubic measurement
  //       return { ...updatedFormData, CubicMeasurement: "" };
  //     }
  //   });
  // } else {
  //   // For other fields, update the form data without validation
  //   setFormData({ ...formData, [fieldName]: value });
  // }
  // };
  const handleFieldChange = (
    fieldName: string,
    value: string | boolean | string[] | number | null | undefined
  ) => {
    console.log("type of", typeof value);
    if (
      fieldName === "Length" ||
      fieldName === "Width" ||
      fieldName === "Height"
    ) {
      setFormData((prevState: any) => {
        const updatedFormData = { ...prevState, [fieldName]: value };

        // Check if all three fields have values entered
        const length = parseFloat(updatedFormData["Length"] || "");
        const width = parseFloat(updatedFormData["Width"] || "");
        const height = parseFloat(updatedFormData["Height"] || "");

        if (!isNaN(length) && !isNaN(width) && !isNaN(height)) {
          // Calculate cubic measurement (length * width * height)
          const cubicMeasurement = (length * width * height).toFixed(2); // Round to six decimal places
          return { ...updatedFormData, CubicMeasurement: cubicMeasurement };
        } else {
          // If any of the fields is empty or not a number, clear the cubic measurement
          return { ...updatedFormData, CubicMeasurement: "" };
        }
      });
    } else {
      // For other fields, update the form data without validation
      setFormData({ ...formData, [fieldName]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      // Optionally, you can also display a preview of the selected image here
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, Image: reader.result as string });
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const checkExistingProduct = async (
    Name: string,
    Code: string,
    existingProducts: { Name: string; Code: string }[]
  ): Promise<boolean> => {
    const existingProduct = existingProducts.some(
      (product) => product.Name === Name || product.Code === Code
    );
    return existingProduct;
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Form data:", formData);
  //   console.log("File:", file);

  //   try {
  //     await YupValidation.validate(formData, { abortEarly: false });
  //     console.log("Validation passed");
  //   } catch (validationError) {
  //     console.log("Validation error:", validationError);
  //     const errors: { [key: string]: string } = {};
  //     validationError.inner.forEach((error: any) => {
  //       errors[error.path] = error.message;
  //     });
  //     setFieldErrors(errors);
  //     return;
  //   }
  //   setUploading(true);
  //   // Prepare form data including the file
  //   const formDataWithFile = new FormData();
  //   Object.entries(formData).forEach(([key, value]) => {
  //     formDataWithFile.append(key, value); // Append other form data fields
  //   });
  //   if (file) {
  //     formDataWithFile.append("file", file); // Append file to FormData if it exists
  //   }

  //   // Send form data with file to backend
  //   const response = await fetch("/api/s3-Upload", {
  //     method: "POST",
  //     body: formDataWithFile,
  //   });

  //   // Handle response
  //   if (response.ok) {
  //     // File uploaded successfully, handle other form submission logic here
  //     const data = await response.json();

  //     // let imageUrl = productData.products.Image || "";
  //     if (data.imageUrl) {
  //       imageUrl = data.imageUrl; // Update imageUrl with the uploaded image URL
  //     }
  //     if (file) {
  //       setFormData((prevData: any) => ({
  //         ...prevData,
  //         Image: data.imageUrl,
  //       }));
  //     }
  //     // Proceed with creating/updating contact with the received file name

  //     // Create or update contact with the image URL
  //     const productData = {
  //       ...formData,
  //       Image: file ? data.imageUrl : undefined, // Use the imageUrl from S3 if the file was uploaded
  //     };
  //     console.log("productData", productData);
  //     try {
  //       if (!editData) {
  //         const productExists = await checkExistingProduct(
  //           formData.Name,
  //           formData.Code,
  //           existingProducts
  //         );

  //         if (productExists) {
  //           console.log("A product with the same name or code already exists");
  //           const errors: { [key: string]: string } = {};

  //           // Check if the existing products contain the same name or code
  //           const existingProductWithName = existingProducts.find(
  //             (product: { Name: any }) => product.Name === formData.Name
  //           );
  //           const existingProductWithCode = existingProducts.find(
  //             (product: { Code: any }) => product.Code === formData.Code
  //           );

  //           // Set errors for both fields if they are duplicates
  //           if (existingProductWithName) {
  //             errors.Name = "Item name exists!";
  //           }
  //           if (existingProductWithCode) {
  //             errors.Code = "Item code exists!";
  //           }

  //           // Set all errors at once
  //           setFieldErrors({
  //             ...fieldErrors,
  //             ...errors,
  //           });

  //           return;
  //         }
  //       }
  //       if (editData) {
  //         const existingProductWithName = existingProducts.find(
  //           (product: { Name: any; _id: any }) =>
  //             product.Name === formData.Name && product._id !== formData._id
  //         );

  //         const existingProductWithCode = existingProducts.find(
  //           (product: { Code: any; _id: any }) =>
  //             product.Code === formData.Code && product._id !== formData._id
  //         );

  //         const errors: { [key: string]: string } = {};

  //         if (existingProductWithName && existingProductWithCode) {
  //           errors.Name = "Item name  exists!";
  //           errors.Code = "Item code  exists!";
  //         } else {
  //           if (existingProductWithName) {
  //             errors.Name = "Item name  exists!";
  //           }
  //           if (existingProductWithCode) {
  //             errors.Code = "item code  exists!";
  //           }
  //         }
  //         if (Object.keys(errors).length > 0) {
  //           setFieldErrors({
  //             ...fieldErrors,
  //             ...errors,
  //           });
  //           return;
  //         }
  //         await updateProduct("", productData);
  //         onSnackbarOpen();
  //       } else {
  //         await createProduct(productData);
  //         onSnackbarOpen();
  //       }
  //       refetch();
  //       setFormData({});
  //       setOpen(handleCloseData);
  //       setOpenForm(handleCloseForm);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   }
  //   // Set uploading state back to false regardless of success or failure
  //   setUploading(false);
  // };
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   console.log("Form data:", formData);
  //   console.log("File:", file);

  //   try {
  //     await YupValidation.validate(formData, { abortEarly: false });
  //     console.log("Validation passed");
  //   } catch (validationError) {
  //     console.log("Validation error:", validationError);
  //     const errors: { [key: string]: string } = {};
  //     validationError.inner.forEach((error: any) => {
  //       errors[error.path] = error.message;
  //     });
  //     setFieldErrors(errors);
  //     return;
  //   }

  //   setUploading(true);
  //   // Prepare form data
  //   const formDataWithoutFile: {
  //     [key: string]: string | number | string[] | undefined;
  //   } = {};
  //   Object.entries(formData).forEach(([key, value]) => {
  //     if (key !== "Image") {
  //       // Exclude the 'Image' field if it's present
  //       formDataWithoutFile[key] = value;
  //     }
  //   });

  //   // If file is uploaded, prepare form data including the file
  //   if (file) {
  //     const formDataWithFile = new FormData();
  //     Object.entries(formDataWithoutFile).forEach(([key, value]) => {
  //       formDataWithFile.append(key, value as string); // Append other form data fields
  //     });
  //     formDataWithFile.append("file", file); // Append file to FormData
  //     try {
  //       // Send form data with file to backend
  //       const response = await fetch("/api/s3-Upload", {
  //         method: "POST",
  //         body: formDataWithFile,
  //       });

  //       // Handle response
  //       if (response.ok) {
  //         // File uploaded successfully, handle other form submission logic here
  //         const data = await response.json();
  //         const productData = {
  //           ...formDataWithoutFile,
  //           Image: data.imageUrl, // Use the imageUrl from S3
  //         };

  //         // Proceed with creating/updating product data
  //         if (editData) {
  //           await updateProduct(editData.id, productData);
  //           onSnackbarOpen();
  //         } else {
  //           await createProduct(productData);
  //           onSnackbarOpen();
  //           refetch();
  //         }

  //         // Reset form and state
  //         refetch();
  //         setFormData({});
  //         setFile(null);
  //         handleCloseData?.();
  //         handleCloseForm?.();
  //       } else {
  //         console.error("Failed to upload file:", response.statusText);
  //         toast.error("Failed to upload file.");
  //       }
  //     } catch (error) {
  //       console.error("Error uploading file:", error);
  //       toast.error("Error uploading file.");
  //     }
  //   } else {
  //     const productData = formDataWithoutFile;
  //     if (editData) {
  //       await updateProduct(editData.id, productData);
  //       onSnackbarOpen();
  //     } else {
  //       await createProduct(productData);
  //       onSnackbarOpen();
  //     }
  //     setFormData({});
  //     setFile(null);
  //     handleCloseData?.();
  //     handleCloseForm?.();
  //   }
  //   setUploading(false);
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate form data
      await YupValidation.validate(formData, { abortEarly: false });
      console.log("Validation passed");
    } catch (validationError) {
      // Handle validation errors
      console.log("Validation error:", validationError);
      const errors: { [key: string]: string } = {};
      validationError.inner.forEach((error: any) => {
        errors[error.path] = error.message;
      });
      setFieldErrors(errors);
      return;
    }

    if (await checkProductExistence()) {
      console.log("A product with the same name or code already exists");
      return;
    }

    // If no validation errors and no product existence issues, proceed with form submission
    setUploading(true);

    try {
      let productData = { ...formData };

      if (file) {
        // Handle file upload if a file is selected
        productData = await uploadFile(productData);
      }

      // Create or update product data
      if (editData) {
        await updateProduct(editData.id, productData);
      } else {
        console.log(productData);
        await createProduct(productData);
      }

      onSnackbarOpen();
      refetch();
      setFormData({});
      setFile(null);
      handleCloseData?.();
      handleCloseForm?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form.");
    } finally {
      setUploading(false);
    }
  };

  const checkProductExistence = async () => {
    const existingProductWithName = existingProducts.find(
      (product: { Name: any; _id: any }) =>
        product.Name === formData.Name && product._id !== formData._id
    );
    const existingProductWithCode = existingProducts.find(
      (product: { Code: any; _id: any }) =>
        product.Code === formData.Code && product._id !== formData._id
    );

    if (existingProductWithName || existingProductWithCode) {
      const errors: { [key: string]: string } = {};

      if (existingProductWithName) {
        errors.Name = "Product name exists!";
      }
      if (existingProductWithCode) {
        errors.Code = "Product code exists!";
      }

      setFieldErrors({
        ...fieldErrors,
        ...errors,
      });

      return true;
    }

    return false;
  };

  const uploadFile = async (productData: any) => {
    const formDataWithFile = new FormData();

    // Append other form data fields
    Object.entries(productData).forEach(([key, value]) => {
      formDataWithFile.append(key, value as string);
    });

    formDataWithFile.append("file", file); // Append file to FormData

    // Send form data with file to backend
    const response = await fetch("/api/s3-Upload", {
      method: "POST",
      body: formDataWithFile,
    });

    if (!response.ok) {
      console.error("Failed to upload file:", response.statusText);
      toast.error("Failed to upload file.");
      throw new Error("Failed to upload file");
    }

    const data = await response.json();

    // Use the imageUrl from S3
    return { ...productData, Image: data.imageUrl };
  };
  const closeModel = () => {
    setOpen(handleCloseData);
    setOpenForm(handleCloseForm);
  };
  const handleModelSize = () => {
    setShowModel(true);
    setDisplaySize(true);
  };
  const handleSaveSize = async (e: any) => {
    e.preventDefault();
    if (!currentFieldName) {
      toast.error("Size field cannot be empty");
      return;
    }
    if (editDataForProductSize) {
      await UpdateProductSize(editDataForProductSize.id, currentFieldName);
      refetchProductSize();
      setCurrentFieldName("");
    } else {
      await createProductSize(currentFieldName);
    }
    setFormData({ ...formData, Size: currentFieldName });
    setCurrentFieldName("");
    refetchProductSize();
    setShowModel(false);
  };
  const handleCloseEditForm = () => {
    setShowModel(false);
  };
  const updateFormDataFromSidebar = (formSelectedData: any) => {
    console.log(formSelectedData);
    setCurrentFieldName(formSelectedData.Size);
    seteditDataForProductSize(formSelectedData);
  };
  const handleReset = () => {
    setCurrentFieldName("");
  };
  const handleBlur = (
    event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>,
    fieldName: string
  ) => {
    setFieldErrors({
      ...fieldErrors,
      [fieldName]: "",
    });
    event.target.value = event.target.value.replace(/\s+/g, " ");
    handleFieldChange(fieldName, event.target.value);
  };
  const renderFormField = (fieldName: string, field: SchemaField) => {
    const error = fieldErrors[fieldName];

    const isRequired =
      field.label === "Item Name" ||
      field.label === "Item Code" ||
      field.label === "Unit" ||
      field.label === "Weight(Kg)/Unit";
    switch (field.type) {
      case "checkboxes":
        return (
          <>
            <Typography variant="subtitle1" gutterBottom>
              {field.label}
            </Typography>
            {field.options?.map((option: string) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={(formData[fieldName] || []).includes(option)}
                    onChange={(e) => {
                      const updatedValues = Array.isArray(formData[fieldName])
                        ? [...formData[fieldName]]
                        : [];
                      if (e.target.checked) {
                        updatedValues.push(option);
                      } else {
                        const index = updatedValues.indexOf(option);
                        if (index !== -1) {
                          updatedValues.splice(index, 1);
                        }
                      }
                      handleFieldChange(fieldName, updatedValues);
                    }}
                  />
                }
                label={option}
              />
            ))}
          </>
        );
      case "file":
        return (
          <>
            <input
              type="file"
              id="upload-file"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e)}
            />
            <label htmlFor="upload-file">
              <Button
                style={{ marginTop: "18px", padding: "8px" }}
                variant="contained"
                component="span"
                color="primary"
                startIcon={<ImageIcon />}
              >
                Upload Img
              </Button>
            </label>
            {formData.Image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={formData.Image}
                alt="Selected Image"
                style={{ maxWidth: "90%", marginTop: "10px" }}
              />
            )}
          </>
        );
      case "textarea":
        return (
          <>
            <TextField
              label={field.label}
              multiline
              rows={4}
              fullWidth
              value={formData[fieldName]}
              onChange={(e) => {
                handleFieldChange(fieldName, e.target.value);
              }}
            />
          </>
        );
      case "text":
        return (
          <>
            <TextField
              label={isRequired ? `${field.label}*` : field.label}
              multiline={field.type === "text"}
              value={formData[fieldName] || ""}
              onChange={(e) => handleFieldChange(fieldName, e.target.value)}
              onKeyPress={(e) => {
                let errorMessage = "";
                const minLength = 1;
                const currentValue = (e.target as HTMLInputElement).value || "";
                if (currentValue.length < minLength) {
                  errorMessage = `${field.label} should be 2 characters`;
                }
                if (field.label === "Item Name") {
                  if (!/^[a-zA-Z\s]*$/.test(e.key)) {
                    e.preventDefault();
                    errorMessage = "ItemName* can only contain alphabets ";
                  }
                } else if (field.label === "Item Code") {
                  if (!/[a-zA-Z0-9\s]/.test(e.key)) {
                    e.preventDefault();
                    errorMessage = "ItemCode* can only alphabets or integers";
                  }
                }
                const maxLength = 20;

                if (currentValue.length >= maxLength) {
                  e.preventDefault();
                  errorMessage = `Maximum limit reached (${field.label} should be  20 characters or less)`;
                }
                setFieldErrors({
                  ...fieldErrors,
                  [fieldName]: errorMessage,
                });
              }}
              fullWidth
              margin="normal"
              onBlur={(e) => handleBlur(e, fieldName)}
            />

            {/* {formData[fieldName] && error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )} */}

            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </>
        );
      case "select":
        return (
          <>
            <TextField
              select
              label={isRequired ? `${field.label}*` : field.label}
              value={formData[fieldName] || ""}
              onChange={(e) => handleFieldChange(fieldName, e.target.value)}
              onBlur={() => {
                if (formData[fieldName]) {
                  setFieldErrors({ ...fieldErrors, [fieldName]: "" });
                }
              }}
              fullWidth
              margin="normal"
            >
              {field.label == "Unit"
                ? field.options?.map((option: string) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))
                : manageSize.ProductSizes?.map((productSize: any) => (
                    <MenuItem key={productSize._id} value={productSize.Size}>
                      {productSize.Size}
                    </MenuItem>
                  ))}
            </TextField>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
            {field.label !== "Unit" && (
              <Button onClick={handleModelSize} variant="outlined">
                Add Size
              </Button>
            )}
          </>
        );

      case "boolean":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={formData[fieldName]}
                onChange={(e) => handleFieldChange(fieldName, e.target.checked)}
              />
            }
            label={field.label}
          />
        );
      case "number":
        return (
          <>
            <TextField
              label={isRequired ? `${field.label}*` : field.label}
              type="number" // Set type to "number" for decimal input and improved UX
              value={formData[fieldName]?.toString() || ""} // Handle undefined values in formData
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                let value = e.target.value;

                // Prevent entering negative values
                if (parseFloat(value) < 0) {
                  value = ""; // Reset value to empty if negative
                }

                if (e.keyCode === 8 && value.length > 0) {
                  // Remove last character on Backspace (if there's a value)
                  const newValue = value.slice(0, -1);
                  setFormData({
                    ...formData,
                    [fieldName]:
                      newValue === "" ? undefined : parseFloat(newValue),
                  }); // Update with parsed value or undefined if empty
                } else {
                  const parsedValue = parseFloat(value);
                  if (!isNaN(parsedValue) || value === "") {
                    setFieldErrors({
                      ...fieldErrors,
                      [fieldName]: "",
                    });
                    handleFieldChange(
                      fieldName,
                      value === "" ? undefined : parsedValue
                    );
                  } else {
                    setFieldErrors({
                      ...fieldErrors,
                      [fieldName]: "Invalid value",
                    });
                  }
                }
              }}
              fullWidth
              margin="normal"
            />

            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </>
        );

      case "Date":
        return (
          <TextField
            label={field.label}
            type="date"
            value={formData[fieldName] || ""}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
      case "radio":
        return (
          <>
            <Typography variant="subtitle1" gutterBottom>
              {field.label}
            </Typography>
            {field.options?.map((option: string) => (
              <FormControlLabel
                // label={field.label}
                key={option}
                control={
                  <Radio
                    checked={formData[fieldName] === option}
                    onChange={() => handleFieldChange(fieldName, option)}
                  />
                }
                label={option}
              />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* <Box sx={{ p: 0, borderRadius: 9 }}> */}
      <form onSubmit={handleSubmit}>
        <Typography
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.3rem",
          }}
        >
          {editData ? "EDIT PRODUCT" : "ADD PRODUCT"}
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(selectedSchema).map(([fieldName, field]) => (
            <Grid item xs={6} key={fieldName}>
              <>
                <Typography variant="subtitle1" gutterBottom></Typography>
                {renderFormField(fieldName, field)}
              </>
            </Grid>
          ))}
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              color="primary"
              style={{ marginRight: 5 }}
              onClick={closeModel}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editData ? "Update" : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Modal open={showModel} onClose={handleCloseEditForm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: "5px",
            p: 1,
            width: "90%", // Adjust width as needed
            maxWidth: "600px", // Set maximum width for larger screens
            margin: "auto", // Center horizontally
          }}
        >
          {/* <Paper style={{ width: 400, padding: 10 }}> */}
          <Grid
            container
            style={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Grid item xs={6}>
              <Typography variant="h6">MANAGE SIZE</Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right", cursor: "pointer" }}>
              <CloseIcon onClick={handleCloseEditForm} />
            </Grid>
            <hr />
            <Grid container spacing={2}>
              <Grid item xs={6} style={{ paddingLeft: 17 }}>
                <Box>
                  <SideBar
                    sizeManage={displaySize}
                    updateDataForm={updateFormDataFromSidebar}
                    SizeCloseModel={handleCloseEditForm}
                  />
                </Box>
              </Grid>

              <Grid item xs={6} style={{ marginTop: -6 }}>
                <Select
                  style={{ marginTop: 16 }}
                  value={currentFieldName}
                  onChange={(e) => setCurrentFieldName(e.target.value)}
                  fullWidth
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Size
                  </MenuItem>
                  <MenuItem value="small">Small</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="large">Large</MenuItem>
                </Select>

                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 5,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleReset}
                    style={{ marginRight: 5 }}
                  >
                    RESET
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveSize}
                  >
                    SAVE
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default MyForm;
