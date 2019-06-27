const { updateComment } = require("../models/comments-models.js");

const patchComment = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  if (!inc_votes) {
    next({
      status: 400,
      msg: "Bad request - no increment/decrement value provided"
    });
  } else {
    updateComment(inc_votes, comment_id)
      .then(updatedComment => {
        res.status(200).send({ updatedComment });
      })
      .catch(next);
  }
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id).then(message => {
    res.status(204)
  }).catch(next)
};

module.exports = { patchComment, deleteComment };
