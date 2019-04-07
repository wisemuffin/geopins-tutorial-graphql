const { AuthenticationError } = require("apollo-server");

const user = {
  _id: "1",
  name: "David Griffiths",
  email: "davidgg777@hotmail.com",
  picture: "https://cloudinary.com/asdf"
};

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.currentUser) {
    throw new AuthenticationError(`you must be logged in`);
  }
  return next(root, args, ctx, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, ctx) => ctx.currentUser)
    // me: (root, args, ctx) => ctx.currentUser
    // me: () => user
  }
};
