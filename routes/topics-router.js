const topicsRouter = require("express").Router();
const { sendTopics, postTopic } = require("../controllers/topics-controllers.js");
const {sendMethodNotAllowed} = require('../errors/index.js')

topicsRouter.route("/").get(sendTopics).post(postTopic).all(sendMethodNotAllowed)

module.exports = topicsRouter;
