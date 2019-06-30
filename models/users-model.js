const connection = require("../db/connection.js");

const fetchUser = username => {
  return connection
    .first("*")
    .from("users")
    .where("username", username)
    .then(user => {
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: "User not found"
        });
      } else return user;
    })
};

const addUser = user => {
  return connection
    .insert(user)
    .into('users')
    .returning('*')
    .then(([user]) => user)
}

module.exports = { fetchUser, addUser };
