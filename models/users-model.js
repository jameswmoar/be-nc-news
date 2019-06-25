const connection = require('../db/connection.js')

const fetchUser = (username) => {
  return connection
  .first('*')
  .from('users')
  .where('username', username)
}

module.exports = {fetchUser}