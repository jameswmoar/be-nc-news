const connection = require("../db/connection.js");

const fetchTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

const fetchTopicByName = topic => {
  return connection
    .first("*")
    .from("topics")
    .where("slug", "=", topic)
    .returning("*")
    .then(topic => {
      if (!topic) {
        return Promise.reject({
          status: 404,
          msg: "Topic not found"
        });
      } else return topic;
    });
};

module.exports = { fetchTopics, fetchTopicByName };
