const usersRouter = require('express').Router()
const { sendUser } = require('../controllers/users-controllers.js')
const {sendMethodNotAllowed} = require('../errors/index.js')

usersRouter.route('/').all(sendMethodNotAllowed)

usersRouter.route('/:username').get(sendUser).all(sendMethodNotAllowed)


module.exports = usersRouter