const { AuthenticationError } = require("apollo-server");
const Pin = require("./models/Pin");

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError(`you must be logged in`);
  }
  console.log("authentic: users is logged in");
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser),
    me2: (root, args, ctx) => ctx.currentUser
    // me: (root, args, ctx) => ctx.currentUser
    // me: () => user
  },
  Mutation: {
    createPin: authenticated(async (root, args, ctx) => {
      console.log("resolver: args = ", args);
      const newPin = await new Pin({
        ...args.input,
        author: ctx.currentUser._id
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      console.log("resolver: pinAdded = ", pinAdded);
      return pinAdded;
    })
  }
  // Mutation: {
  //   createPin: async (root, args, ctx) => {
  //     const newPin = await new Pin({
  //       ...args.input
  //       // author: ctx.currentUser._id
  //     }).save();
  //     console.log("resolver: newPin = ", newPin);
  //     // const pinAdded = await Pin.populate(newPin, "author");
  //     // console.log("resolver: pinAdded = ", pinAdded);
  //     return pinAdded;
  //   }
  // }
};
