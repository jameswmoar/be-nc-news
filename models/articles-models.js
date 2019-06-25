const connection = require('../db/connection.js')

const fetchArticle = (article_id) => {
  return connection
  .first('*')
  .from('articles')
  .where('article_id', article_id)
}


module.exports = { fetchArticle }