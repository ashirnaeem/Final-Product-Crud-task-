// import express, { Application } from "express";
// import { ApolloServer } from "apollo-server-express";
// import { createServer } from "http";
// import { SubscriptionServer } from "subscriptions-transport-ws";
// import { execute, subscribe } from "graphql";
// import { makeExecutableSchema } from "@graphql-tools/schema";
// import mongoose from "mongoose";
// import cors from "cors";

// const contactTypeDefs = require("./Contact/typeDefs.ts");
// const contactResolvers = require("./Contact/resolvers.ts");
// import productTypeDefs from './Product/typeDefs';
// import productResolvers from './Product/resolvers';

// const MONGODB = "mongodb://172.28.3.74:27017/Final";

// async function startServer() {
//   const app: Application = express();
//   const httpServer = createServer(app);
//   const typeDefs = [contactTypeDefs, productTypeDefs];
//   const resolvers = [contactResolvers, productResolvers];

//   app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://172.28.3.74:5000/graphql"); 
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });
//   await server.start();
//   server.applyMiddleware({ app: app as any }); 
//   await mongoose.connect(MONGODB, {});
//   console.log("Connected to database");

//   const schema = makeExecutableSchema({ typeDefs, resolvers });

//   SubscriptionServer.create(
//     { execute, subscribe, schema },
//     { server: httpServer, path: server.graphqlPath }
//   );

//   httpServer.listen(PORT, () =>
//     console.log(`🚀 http://172.28.3.74:${PORT}${server.graphqlPath}`)
//   );
// }

// const PORT = 5000;
// startServer().catch((err) => console.error("Error starting server:", err));

// import express, { Application } from "express";
// import { ApolloServer } from "apollo-server-express";
// import { createServer } from "http";
// import { SubscriptionServer } from "subscriptions-transport-ws";
// import { execute, subscribe } from "graphql";
// import { makeExecutableSchema } from "@graphql-tools/schema";
// import mongoose from "mongoose";
// import cors from "cors";

// const https = require('https'); // Import for HTTPS functionality
// import fs from "fs"
// const contactTypeDefs = require("./Contact/typeDefs.ts");
// const contactResolvers = require("./Contact/resolvers.ts");
// import productTypeDefs from './Product/typeDefs';
// import productResolvers from './Product/resolvers';

// const MONGODB = "mongodb://172.28.3.74:27017/Final"; // Assuming MongoDB connection details

// async function startServer() {
//   const app = express();
//   const httpServer = createServer(app); // Create an HTTP server

//   // Configure SSL credentials (replace with your actual certificate and key paths)
//   const httpsOptions = {
//     cert: fs.readFileSync("server.cert"),
//     key: fs.readFileSync("server.key"),
//   };

//   const typeDefs = [contactTypeDefs, productTypeDefs];
//   const resolvers = [contactResolvers, productResolvers];

//   app.use(cors({ origin: "https://studio.apollographql.com" }));


//   const schema = makeExecutableSchema({ typeDefs, resolvers });

//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });

//   await server.start();
//   server.applyMiddleware({ app: app as any });

//   await mongoose.connect(MONGODB, {});
//   console.log("Connected to database");

//   const subscriptionServer = SubscriptionServer.create(
//     { schema, execute, subscribe },
//     { server: httpServer, path: server.graphqlPath }
//   );

//   // Create an HTTPS server using the configured options
//   const httpsServer = https.createServer(httpsOptions, app);

//   httpsServer.listen(PORT, () =>
//     console.log(
//       ` https://172.28.3.74:${PORT}${server.graphqlPath}`
//     )
//   );
// }

// const PORT = 5000;
// startServer().catch((err) => console.error("Error starting server:", err));




const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

import { ApolloServer } from "apollo-server-express";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import mongoose from "mongoose";
 const contactTypeDefs = require("./Contact/typeDefs.ts");
 const contactResolvers = require("./Contact/resolvers.ts");
 import productTypeDefs from './Product/typeDefs';
 import productResolvers from './Product/resolvers';

const MONGODB = "mongodb://localhost:27017/Final";

async function startServer() {
  const app = express();
  const httpsOptions = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
  };
  const typeDefs = [contactTypeDefs, productTypeDefs];
   const resolvers = [contactResolvers, productResolvers];

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });
  app.use(cors());

  await mongoose.connect(MONGODB, {});
  console.log("Connected to database");

  const schema = makeExecutableSchema({  typeDefs, resolvers  });

  const httpsServer = https.createServer(httpsOptions, app);

  const PORT = 5000;

  httpsServer.listen(PORT, () =>
    console.log(
      `🚀 Server ready at https://172.28.3.74:${PORT}${server.graphqlPath}`
    )
  );

  SubscriptionServer.create(
    { execute, subscribe, schema },
    { server: httpsServer, path: server.graphqlPath }
  );
}

startServer().catch((err) => console.error("Error starting server:", err));
