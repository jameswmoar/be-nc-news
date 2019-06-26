const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

const handleSQLErrors = (err, req, res, next) => {
  const errorCodes = {
    "22P02": "Bad request - invalid value",
    "42703": "Bad request - invalid sort by value"
  };
  if (errorCodes[err.code]) {
    res.status(400).send({ msg: errorCodes[err.code] });
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
