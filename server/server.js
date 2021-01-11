const express = require('express');
//import Apollo server
const { ApolloServer }= require('apollo-server-express')
//import typdefs and resolvers
const { typeDefs, resolvers } = require('./schemas')
const { authMiddleware } = require('./utils/auth');
const path = require('path');
//mongoose connection
const db = require('./config/connection');
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

//create new Apollo server and pass in schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // jwt token verification before being sent as a header in http request (via context argument in 'me' function within Query resolver)
  context: authMiddleware
})

//integrate Apollo server with the Express application as middleware
server.applyMiddleware({ app })

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//delete when trasferred (moves to typeDefs and resolvers)
// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`)
            // log where we can go to test our GQL API
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);

  });
});
