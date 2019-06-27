const { fetchTopics, fetchTopicByName } = require("../models/topics-models.js");

const sendTopics = (req, res, next) => {
  fetchTopics()
  .then(topics => {
    res.status(200).send({topics})
  })
};

const sendTopicByName = (req, res, next) => {
  const {topic} = req.params
  fetchTopicByName(topic)
  .then(topic => {
    res.status(200).send({topic})
  }).catch(next)
}

module.exports = { sendTopics, sendTopicByName };
