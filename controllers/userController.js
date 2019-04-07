const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async token => {
  // verify the auth token
  const googleUser = await verifyAuthToke(token);
  console.log(googleUser);
  // check if user exists
  const user = await checkIfUserExists(googleUser.email);
  console.log(user);
  // if user exists then return them; othewise create new user in db
  return user ? user : createNewUser(googleUser);
};

const verifyAuthToke = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (err) {
    console.error("error verifying auth token", err);
  }
};

const checkIfUserExists = async email => await User.findOne({ email }).exec();

const createNewUser = googleUser => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};
