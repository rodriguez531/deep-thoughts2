const express = require('express');
//import ApolloServer
const { ApolloServer } = require('apollo-server-express');

//import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
//create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//create a new instance of an apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers ) => {
  await server.start();
  //integrate our Apollo server with the express application as middleware
  server.applyMiddleware({ app });
}

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    //log where we can go to test our GQL API
    console.log(`Use graphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

//call the async function to start the server
startApolloServer(typeDefs, resolvers);