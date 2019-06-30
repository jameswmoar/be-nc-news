const usersRouter = require('express').Router()
const { sendUserByName, postUser } = require('../controllers/users-controllers.js')
const {sendMethodNotAllowed} = require('../errors/index.js')

usersRouter.route('/').post(postUser).all(sendMethodNotAllowed)

usersRouter.route('/:username').get(sendUserByName).all(sendMethodNotAllowed)


module.exports = usersRouter