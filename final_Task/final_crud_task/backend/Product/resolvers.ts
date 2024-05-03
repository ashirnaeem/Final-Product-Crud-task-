// resolvers.js

import Products from './productModel';
import ProductSize from './productSizeModel';

const resolvers = {
  Query: {
    Products: async () => {
      const products = await Products.find();
      return products;
    },
    Product: async (_: any, { _id }: any) => {
      return await Products.findById(_id);
    },
    ProductSizes: async () => {
      const productSizes = await ProductSize.find({ Size: { $ne: null } });
      return productSizes;
    },
    ProductSize: async (_: any, { id }: any) => {
      return await ProductSize.findById(id);
    },
  },
  Mutation: {
    addProduct: async (_: any, { product }: any) => {

      const newProduct = new Products(product);
      await newProduct.save();
      return newProduct;
    },
    // updateProduct: async (_: any, { _id, product }: any) => {
    //   delete product._id;
    //   const updatedProduct = await Products.findByIdAndUpdate(_id, product, { new: true });
    //   return updatedProduct;
    // },
    updateProduct: async (_: any, { _id, product }: any) => {
      console.log(product);
      
      // Validate and trim Name
      if (product.Name) {
        // Reduce multiple spaces to a single space
        product.Name = product.Name.replace(/\s+/g, ' ').trim();
    
        // Validate Name format
        if (!/^[a-zA-Z\s]+$/.test(product.Name)) {
          throw new Error("Only alphabets are allowed for the name field");
        }
        
        // Validate Name length
        if (product.Name.length < 2 || product.Name.length > 20) {
          throw new Error("Name must be between 2 and 20 characters long");
        }
      } else {
        throw new Error("Name is required");
      }
    
      // Validate and trim Code
      if (product.Code) {
        // Reduce multiple spaces to a single space
        product.Code = product.Code.replace(/\s+/g, ' ').trim();
    
        // Validate Code format
        if (!/^[a-zA-Z0-9\s]+$/.test(product.Code)) {
          throw new Error("Only alphabets or integers are allowed for the code field");
        }
    
        // Validate Code length
        if (product.Code.length < 2 || product.Code.length > 20) {
          throw new Error("Code must be between 2 and 20 characters long");
        }
      } else {
        throw new Error("Code is required");
      }
    
      // Validate Weight
      if (!product.Weight || parseFloat(product.Weight) <= 0) {
        throw new Error("Invalid Input on Weight: " + product.Weight);
      }
    
      // Validate Unit
      if (!product.Unit || !product.Unit.every((unit:any) => ['Number', 'kilo', 'M3', 'Tonne'].includes(unit))) {
        throw new Error("Unit is required and must contain only the values: number, kilo, M3, Tonne");
      }
    
      // Check if another product with the same name exists and has a different ID
      const existingProductWithName = await Products.findOne({ Name: product.Name });
      if (existingProductWithName && existingProductWithName._id.toString() !== _id.toString()) {
        throw new Error(`Product with name "${product.Name}" already exists`);
      }
    
      // Check if another product with the same code exists and has a different ID
      const existingProductWithCode = await Products.findOne({ Code: product.Code });
      if (existingProductWithCode && existingProductWithCode._id.toString() !== _id.toString()) {
        throw new Error(`Product with code "${product.Code}" already exists`);
      }
    
      // Proceed with updating the product
      const updatedProduct = await Products.findByIdAndUpdate(_id, product, { new: true });
      return updatedProduct;
    },
    
    
    
  
    deleteProduct: async (_: any, { _id }: any) => {
      const deletedProduct = await Products.findByIdAndDelete(_id);
      if (!deletedProduct) {
        throw new Error(`Product with ID ${_id} not found or Already Deleted`);
      }
      return deletedProduct;
    },
    addProductSize: async (_: any, { Size }: any) => {  
      console.log(Size)
      const newProductSize = new ProductSize({ Size });  
      await newProductSize.save();
      return newProductSize;
    },
//  updateProductSize: async (_: any, { id, Size }: any) => {
//   const updatedProductSize = await ProductSize.findByIdAndUpdate(id, { Size: Size }, { new: true });
//   return updatedProductSize;
// },

updateProductSize: async (_: any, { id, Size }: any) => {
  // Validate Size
  if (!Size || !['small', 'medium', 'large'].includes(Size)) {
    throw new Error("Size is required and must be one of: small, medium, large");
  }

  const updatedProductSize = await ProductSize.findByIdAndUpdate(id, { Size: Size }, { new: true });
  return updatedProductSize;
},

    deleteProductSize: async (_: any, { id }: any) => {
      const deletedProductSize = await ProductSize.findByIdAndDelete(id);
      if(!deletedProductSize){
        throw new Error(`Product size with ID ${id} not found`)
      }
      return deletedProductSize;
    },
  },
};

export default resolvers;
