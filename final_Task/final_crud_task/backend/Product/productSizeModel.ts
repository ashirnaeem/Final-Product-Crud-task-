import { Schema, model } from 'mongoose';
const validateSize = (value: any) => {
    const validSizes = ["small", "medium", "large"];
    if (!value) {
      throw new Error("Size is required");
    }
    if (!validSizes.includes(value)) {
      throw new Error("Invalid size. Valid sizes are small, medium, and large");
    }
  };
  
const ProductSizeSchema = new Schema({
 
    Size:{
    type:String,
    // required:true,
    validate: [validateSize, "Invalid size. Valid sizes are small, medium, and large"]
}
    
});
const ProductSize = model('ProductSize', ProductSizeSchema);

export default ProductSize;