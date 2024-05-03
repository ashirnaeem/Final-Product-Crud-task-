export const ProductSchema = {
    Name: { label: "Item Name", type: "text"},
    Code: { label: "Item Code", type: "text" },
    Image: { label: "Image", type: "file" },
    Unit: {
        label: "Unit",
        type: "select",
        options: ["kilo", "Number", "Tonne","M3"],
      },
      Size : {
      label: "Size ",
      type: "select",
      // options: ["small", "medium", "large"],
    },
  
      Weight : { label: "Weight(Kg)/Unit", type: "number"},
      Length: { label: "Length(cm)", type: "number" },
      Width : { label: "Width(cm)", type: "number" },
      Height : { label: "Height(cm)", type: "number" },
      CubicMeasurement: {label: "Cubic Measurement", type: "number" },

  
    
    Colors : {
      label: "Colors ",
      type: "radio",
      options: ["Red", "Green","Blue"],
      default: "Red"
    },
    Description : { label: "Description ", type: "textarea" },
    isEnabled: { label: "Enabled", type: "boolean" },
   
  };
  