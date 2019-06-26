const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

const handleSQLErrors = (err, req, res, next) => {
  const badRequestCodes = {
    "22P02": "Bad request - invalid value",
    "42703": "Bad request - invalid sort by value"
  };
  const notFoundCodes = {
    "23503": "Article not found"
  };
  if (badRequestCodes[err.code]) {
    res.status(400).send({ msg: badRequestCodes[err.code] });
  } else if (notFoundCodes[err.code]) {
    res.status(404).send({ msg: notFoundCodes[err.code] });
  } else next(err);
};

sendMethodNotAllowed = (req, res) => {
  res.status(405).send({ msg: "Method not allowed" });
};

const handleServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = {
  handleCustomErrors,
  handleSQLErrors,
  sendMethodNotAllowed,
  handleServerError
};
