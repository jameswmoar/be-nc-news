const { updateComment } = require("../models/comments-models.js");

const patchComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
    updateComment(inc_votes, comment_id)
      .then(comment => {
        res.status(200).send({ comment });
      })
      .catch(next);
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id).then(message => {
    res.sendStatus(204)
  }).catch(next)
};

module.exports = { patchComment, deleteComment };
