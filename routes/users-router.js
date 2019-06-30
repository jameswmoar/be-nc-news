const usersRouter = require('express').Router()
const { sendUserByName, postUser, sendUsers } = require('../controllers/users-controllers.js')
const {sendMethodNotAllowed} = require('../errors/index.js')

usersRouter.route('/').get(sendUsers).post(postUser).all(sendMethodNotAllowed)

usersRouter.route('/:username').get(sendUserByName).all(sendMethodNotAllowed)


module.exports = usersRouter