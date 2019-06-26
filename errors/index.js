

const handleCustomErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  }
};

module.exports = { handleCustomErrors };
