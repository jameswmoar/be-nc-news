const connection = require("../db/connection.js");

const fetchTopics = topics => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

module.exports = { fetchTopics };
