const topicsRouter = require("express").Router();
const { sendTopics, sendTopicByName } = require("../controllers/topics-controllers.js");
const {sendMethodNotAllowed} = require('../errors/index.js')

topicsRouter.route("/").get(sendTopics).all(sendMethodNotAllowed)

topicsRouter.route('/:topic').get(sendTopicByName)

module.exports = topicsRouter;
