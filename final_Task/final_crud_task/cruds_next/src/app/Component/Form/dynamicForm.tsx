import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Switch,
  Box,
  Radio,
  Stack,
  MenuItem,
  Typography,
} from "@mui/material";
import { contactSchema } from "../Contact/ContactSchema";
import { useContactMutations } from "../Contact";
import Sidebar from "../commenComponent/Sidebar/index";
import DeleteUser from "../delete/page";
import Edit from "../Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@apollo/client";
import { GET_CONTACTS } from "../../../../Graphql/queries";

interface SchemaField {
  label: string;
  type: string;
  options?: string[];
}

interface Schema {
  [key: string]: SchemaField;
}

const Contacts: React.FC = ({}) => {
  const { createContact, updateContact, deleteContact } = useContactMutations();
  const [showUpdateForm, setisUpdateMode] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [selectedSchema, setSelectedSchema] = useState<Schema>(contactSchema);
  const { refetch: refetchContacts } = useQuery(GET_CONTACTS); // Destructuring refetch function from useQuery

  const handleFieldChange = (
    fieldName: string,
    value: string | boolean | string[]
  ) => {
    setFormData({ ...formData, [fieldName]: value });
    setFieldErrors({ ...fieldErrors, [fieldName]: "" });
  };
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (showUpdateForm) {
  //     updateContact(selectedContact.id, formData);
  //     toast.success("Contact updated successfully!");
  //     setisUpdateMode(false);
  //   } else {
  //     createContact(formData);
  //     toast.success("Contact created successfully!");
  //   }
  //   setFormData({});
  // };

  // const handleDelete = () => {
  //   if (selectedContact) {
  //     deleteContact(selectedContact.id);
  //     setSelectedContact(null);
  //     setFormData({});
  //     setisUpdateMode(false);
  //     toast.success("Contact deleted successfully!");
  //   }
  //   setisUpdateMode(false);
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (showUpdateForm) {
      await updateContact(selectedContact.id, formData);
      toast.success("Contact updated successfully!");
      setisUpdateMode(false);
    } else {
      await createContact(formData);
      toast.success("Contact created successfully!");
    }
    setFormData({});
    refetchContacts(); // Refetch contacts data after create/update operation
  };

  const handleDelete = async () => {
    if (selectedContact) {
      await deleteContact(selectedContact.id);
      setSelectedContact(null);
      setFormData({});
      setisUpdateMode(false);
      toast.success("Contact deleted successfully!");
      refetchContacts(); // Refetch contacts data after delete operation
    }
    setisUpdateMode(false);
  };

  const showDetails = (data: any) => {
    setSelectedContact(data);
    setFormData(data);
    setisUpdateMode(true);
  };

  const renderFormField = (fieldName: string, field: SchemaField) => {
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

      case "text":
        return (
          <TextField
            label={field.label}
            multiline={field.type === "text"}
            value={formData[fieldName] || ""}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            fullWidth
            margin="normal"
          />
        );

      case "textarea":
        return (
          <TextField
            label={field.label}
            multiline={field.type === "textarea"}
            rows={4}
            value={formData[fieldName] || ""}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            fullWidth
            margin="normal"
          />
        );
      case "select":
        return (
          <TextField
            select
            label={field.label}
            value={formData[fieldName] || ""}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            fullWidth
            margin="normal"
          >
            {field.options?.map((option: string) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
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
            {field.options?.map((option: string) => (
              <FormControlLabel
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
      case "email":
        return (
          <TextField
            label={field.label}
            type="email"
            value={formData[fieldName] || ""}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            fullWidth
            margin="normal"
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Sidebar showDetails={showDetails} />
        </Grid>
        <Grid item xs={7}>
          <Box sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                {Object.entries(selectedSchema).map(([fieldName, field]) => (
                  <Grid item xs={6} key={fieldName}>
                    <>{renderFormField(fieldName, field)}</>
                  </Grid>
                ))}
              </Grid>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="flex-end"
                mt={4}
                mr={4}
                mb={1}
              >
                <Edit showUpdateForm={showUpdateForm} onClick={handleSubmit} />
                {showUpdateForm && <DeleteUser onDelete={handleDelete} />}
              </Stack>
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default Contacts;
