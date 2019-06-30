const { fetchUser, addUser } = require("../models/users-model.js");

const sendUserByName = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const postUser = (req, res, next) => {
  const { body } = req;
  const validUsername = /.{3}/;
  if (validUsername.test(body.username) === false) {
    return next({
      status: 400,
      msg: "Bad request - Username must be at least 3 characters in length"
    });
  } else {
    addUser(body)
      .then(user => {
        res.status(201).send({ user });
      })
      .catch(next);
  }
};

module.exports = { sendUserByName, postUser };
