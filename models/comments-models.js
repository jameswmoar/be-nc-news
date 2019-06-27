const connection = require("../db/connection.js");

updateComment = (inc_votes = 0, comment_id) => {
  return connection
    .first("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then(([article]) => article);
};

removeComment = comment_id => {
  return connection
    .first("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .del()
    .then(deleted => {
      if (!deleted) {
        return Promise.reject({
          status: 404,
          msg: `Comment with ID ${comment_id} not found`
        });
      } else {
        return "Comment deleted";
      }
    });
};

module.exports = { updateComment, removeComment };
