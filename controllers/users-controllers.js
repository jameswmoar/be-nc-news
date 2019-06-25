const { fetchUser } = require("../models/users-model.js");

const sendUser = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username).then(user => {
    res.status(200).send({ user });
  });
};

module.exports = { sendUser };
