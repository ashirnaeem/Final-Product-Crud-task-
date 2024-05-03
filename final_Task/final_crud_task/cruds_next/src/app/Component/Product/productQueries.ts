import { gql } from "@apollo/client";
export const GET_PRODUCT=gql`
query getAllProduct {
    Products {
      _id
      Name
      Code
      Image
      Unit
      Size
      Weight
      Length
      Width
      Height
      CubicMeasurement
      Colors
      Description
      isEnabled
    }
  }
`


export const CREATE_PRODUCT=gql`
mutation($product: FormInput) {
    addProduct(product: $product) {
      _id
      Name
      Code
      Image
      Unit
      Size
      Weight
      Length
      Width
      Height
      CubicMeasurement
      Colors
      Description
      isEnabled
    }
  }`
//  export const CREATE_PRODUCT_SIZE=gql`
//  mutation AddProductSize($productId: ID!, $size: String!) {
//   addProductSize(productID: $productId, size: $size) {
//     _id
//     productId
//     size
//   }
// }` 
  export const UPDATE_PRODUCT=gql`
  mutation($id: ID!, $product: FormInput) {
    updateProduct(_id: $id, product: $product) {
      _id
      Name
      Code
      Image
      Unit
      Size
      Weight
      Length
      Width
      Height
      CubicMeasurement
      Colors
      Description
      isEnabled
    }
  }
  `

export  const  DELETE_PRODUCT=gql`
mutation DeleteProduct($id: ID!) {
  deleteProduct(_id: $id) {
    _id
  }
}`
export const GET_PRODUCT_SIZE=gql`
query ProductSizes {
  ProductSizes {
    id
    Size
  }
}
`
export  const CREATE_PRODUCT_SIZE=gql`
mutation Mutation($size: String!) {
  addProductSize(Size: $size) {
    id
    Size
  }
}
`
export const UPDATE_PRODUCT_SIZE = gql`
mutation Mutation($updateProductSizeId: ID!, $size: String!) {
  updateProductSize(id: $updateProductSizeId, Size: $size) {
    id
    Size
  }
}
`
export const DELETE_PRODUCT_SIZE=gql`
mutation DeleteProductSize($deleteProductSizeId: ID!) {
  deleteProductSize(id: $deleteProductSizeId) {
    id
    Size
  }
}
`
;