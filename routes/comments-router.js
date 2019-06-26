const commentsRouter = require('express').Router()
const {sendMethodNotAllowed} = require('../errors/index.js')

commentsRouter.route('/')
.all(sendMethodNotAllowed)

module.exports = commentsRouter