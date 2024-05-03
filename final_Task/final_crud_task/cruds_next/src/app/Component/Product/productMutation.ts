import { useMutation } from "@apollo/client";
import {
    CREATE_PRODUCT,
    UPDATE_PRODUCT,
  DELETE_PRODUCT,
  CREATE_PRODUCT_SIZE,
  UPDATE_PRODUCT_SIZE,
  DELETE_PRODUCT_SIZE
} from "./productQueries";

const useProductMutations = () => {
  const [createProductMutation] = useMutation(CREATE_PRODUCT);
  const [updateProductMutation] = useMutation(UPDATE_PRODUCT);
  const [deleteProductMutation] = useMutation(DELETE_PRODUCT);
  const[createProductSizeMutation]=useMutation(CREATE_PRODUCT_SIZE);
  const[deleteProductSizeMutation]=useMutation(DELETE_PRODUCT_SIZE);
  const[updateProductSizeMutation]=useMutation(UPDATE_PRODUCT_SIZE);


const createProduct = async (product: any) => {
  console.log("createProduct", product);
    try {
      await createProductMutation({
        variables: {
          product: product,
        },
      });
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  const updateProduct = async (_id:any, product:any) => {
    console.log("updateProduct", product);
    try {
        const { __typename,_id, ...contactWithoutTypename } = product;
        console.log("abcd",contactWithoutTypename);
      await updateProductMutation({
        variables: {
          id: _id,
          product: contactWithoutTypename,
        },
      });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const deleteProduct = async (_id: string) => {
    try {
      await deleteProductMutation({
        variables: {
          id: _id,
        },
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const createProductSize = async (size: string) => {
    console.log( "size",size)
    try {
      await createProductSizeMutation({
        variables: {
          size: size,
        },
      });
    } catch (error) {
      console.error("Error creating product size:", error);
    }
  };
  const UpdateProductSize = async (updateProductSizeId: string, size: string) => {
    // const{__typename,id, ...contactWithoutTypename }= size
    // console.log("size",size)
    try {
      await updateProductSizeMutation({
        variables: {
          updateProductSizeId: updateProductSizeId,
          size: size,
        },
      });
    } catch (error) {
      console.error("Error updating product size:", error);
    }
  };

const deleteProductSize=(deleteProductSizeId:string)=>{
  console.log("deleteProductSizeId",deleteProductSizeId)
  try {
    deleteProductSizeMutation({
      variables: {
        deleteProductSizeId: deleteProductSizeId,
      },
    });
  } catch (error) {
    console.error("Error deleting product size:", error);
  }
}
  return {  createProduct,updateProduct, deleteProduct,createProductSize,UpdateProductSize,deleteProductSize };
};
export default useProductMutations;


