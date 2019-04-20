const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./typeDefs");
const resolvers = require("./resolver");
const { findOrCreateUser } = require("./controllers/userController");
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(console.log(`DB connected`))
  .catch(err => console.log(err));

const server = new ApolloServer({
  typeDefs,
  resolvers,

  // These 2 config allow you to use the apollo playground in prod ... not recomened
  // introspection: true,
  // playground: true,

  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;
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

// when in prod, heroku will set the port else in dev then 4000
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`server listening on ${url}`);
});
