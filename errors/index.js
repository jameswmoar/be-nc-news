const handleCustomErrors = (err, req, res, next) => {
  // console.log(err);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

const handleSQLErrors = (err, req, res, next) => {
  const badRequestCodes = {
    "22P02": "Bad request - invalid value",
    "42703": "Bad request - invalid sort by value",
    "23502": "Bad request - insufficient details provided to post",
    "23505": "Bad request"
  };
  const notFoundCodes = {
    "23503": "Not found",
  };
  if (badRequestCodes[err.code]) {
    if (err.detail) {
      res
        .status(400)
        .send({ msg: `${badRequestCodes[err.code]} - ${err.detail}` });
    } else res.status(400).send({ msg: badRequestCodes[err.code] });
  } else if (notFoundCodes[err.code]) {
    if (err.detail) {
      res
        .status(404)
        .send({ msg: `${notFoundCodes[err.code]} - ${err.detail}` });
    } else res.status(400).send({ msg: badRequestCodes[err.code] });
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
