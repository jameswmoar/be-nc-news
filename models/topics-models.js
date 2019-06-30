const connection = require("../db/connection.js");

const fetchTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

const addComment = body => {
  return connection
    .insert(body)
    .into('topics')
    .returning("*")
    .then(([topic]) => topic)
}

module.exports = { fetchTopics, addComment };
