// "use client";
// import { Inter } from "next/font/google";
// import https from 'https';
// import "./globals.css";
// import { UserProvider } from "@auth0/nextjs-auth0/client";
// import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
// import { ApolloProvider } from "@apollo/client";
// import DynamicForm from "./Component/Form/dynamicForm";

// import { WebSocketLink } from "@apollo/client/link/ws";
// import { getMainDefinition } from "@apollo/client/utilities";
// import MyApp from "./Component/landingPage";
// const inter = Inter({ subsets: ["latin"] });
// const httpLink = new HttpLink({
//   uri: "https://172.28.3.74:5000/graphql",
// });
// const wsLink = new WebSocketLink({
//   uri: "wss://172.28.3.74:5000/graphql",
//   options: {
//     reconnect: true,
//   },
// });
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return (
//       definition.kind === "OperationDefinition" &&
//       definition.operation === "subscription"
//     );
//   },
//   wsLink,
//   httpLink
// );
// const client = new ApolloClient({
//   link: splitLink,
//   cache: new InMemoryCache(),
// });
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ApolloProvider client={client}>
//           <UserProvider>
//             {/* <Data /> */}
//             <MyApp />
//             {children}
//           </UserProvider>
//         </ApolloProvider>
//       </body>
//     </html>
//   );
// }

"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import MyApp from "./Component/landingPage";
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";

import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
const inter = Inter({ subsets: ["latin"] });
const httpLink = new HttpLink({
  uri: "https://172.28.3.74:5000/graphql",
});
const wsLink = new WebSocketLink({
  uri: "wss://172.28.3.58:5000/graphql",
  options: {
    reconnect: true,
  },
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProvider client={client}>
          <UserProvider>
            <MyApp />
            {children}
          </UserProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
