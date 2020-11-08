const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.log(req.method, " ", req.path, " ", req.body);
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
};

const errorHandler = (err, req, res, nxt) => {
  logger.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Incorrect id format" });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  nxt(err);
};

const authTokenGetter = (req, res, nxt) => {
  const auth = req.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    req.token = auth.substring(7);
  } else {
    req.token = null;
  }
  nxt();
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  authTokenGetter,
};
