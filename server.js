const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { findOrCreateUser } = require("./controllers/userController");
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(console.log(`DB connected`))
  .catch(err => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
    // console.log(req);
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        // find or create user in our db
        console.log(authToken);
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.error(`Unable to authenticate user with token ${authToken}`);
    }
    return { currentUser };
  }
});

server.listen().then(({ url }) => {
  console.log(`server listening on ${url}`);
});
