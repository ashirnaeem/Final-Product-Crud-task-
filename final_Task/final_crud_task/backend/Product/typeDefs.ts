

import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    Products: [Product]
    Product(_id: ID!): Product
    ProductSizes: [ProductSize]
    ProductSize(id: ID!): ProductSize
  }
  type Mutation {
    addProduct(product: FormInput): Product!
    updateProduct(_id: ID!, product: FormInput): Product!
    deleteProduct(_id: ID!): Product!
    addProductSize(Size: String!): ProductSize! 
    updateProductSize(id: ID!, Size: String!): ProductSize!
    deleteProductSize(id: ID!): ProductSize!
  }

  type Product {
    _id: ID!
    Name: String!
    Code: String
    Image: String
    Unit: [String]
    Size: [String]
    Weight: Float
    Length: Float
    Width: Float
    Height: Float
    CubicMeasurement:String
    Colors: String
    Description: String
    isEnabled: Boolean
  }

  type ProductSize {
    id: ID!
    Size: String!
  }
  input ProductInput {  # Rename the input type
    Size: String!
  }
  input FormInput {
    Name: String!
    Code: String
    Image: String
    Unit: [String]
    Size: [String]
    Weight: Float
    Length: Float
    Width: Float
    Height: Float
    CubicMeasurement:String
    Colors: String
    Description: String
    isEnabled: Boolean
  }
`;

export default typeDefs;
