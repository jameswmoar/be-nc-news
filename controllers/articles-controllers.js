const { fetchArticle, updateArticle, addComment } = require("../models/articles-models.js");

const sendArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticle = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticle(inc_votes, article_id).then(updatedArticle => {
    res.status(200).send({ updatedArticle });
  });
};

const postComment = (req, res, next) => {
  const { article_id } = req.params
  const {body} = req
  body.article_id = article_id
  addComment(req.body)
  .then(newComment => {
    res.status(201).send({newComment})
  })
}

module.exports = { sendArticle, patchArticle, postComment };
