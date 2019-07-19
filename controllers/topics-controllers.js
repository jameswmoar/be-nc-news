const { fetchTopics, addComment } = require("../models/topics-models.js");

const sendTopics = (req, res, next) => {
  fetchTopics().then(topics => {
    res.status(200).send({ topics });
  });
};

const postTopic = (req, res, next) => {
  const { body } = req;
  const validBody = /.{3}/;
  const whitespaceCheck = /\s+/
  if (whitespaceCheck.test(body.slug) === true) {
    return next({
      status: 400,
      msg: "Bad request - Slug must not contain whitespace"
    })
  }
  else if (validBody.test(body.slug) === false) {
    return next({
      status: 400,
      msg: "Bad request - Slug must be at least 3 characters in length"
    });
  } else if (validBody.test(body.description) === false) {
    return next({
      status: 400,
      msg: "Bad request - description must be at least 3 characters in length"
    })
  }
  else {
    addComment(body)
      .then(topic => {
        res.status(201).send({ topic });
      })
      .catch(next);
  }
};

module.exports = { sendTopics, postTopic };
