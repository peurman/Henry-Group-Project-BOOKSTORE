const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Users } = require('../../db.js');

let autoLogin = {
  verifyTokenLogin: async function (token) {
    const user = jwt.decode(token, process.env.PASS_TOKEN);

    const userExists = await Users.findOne({
      where: {
        username: user.username.toLowerCase(),
      },
    });
    const userJSON = userExists.toJSON();
    return {
      ID: userJSON.ID,
      username: userJSON.username,
      name: userJSON.name,
      lastName: userJSON.surname,
      email: userJSON.email,
    };
  },
};

module.exports = autoLogin;
