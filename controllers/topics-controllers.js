const { fetchTopics } = require("../models/topics-models.js");

const sendTopics = (req, res, next) => {
  fetchTopics()
  .then(topics => {
    res.status(200).send({topics})
  })
};

module.exports = { sendTopics };
