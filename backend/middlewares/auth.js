const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new Error('Необходимо авторизоваться');
    err.statusCode = 401;
    next(err);
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'strong-protection');
  } catch (e) {
    const err = new Error('Необходимо авторизоваться');
    err.statusCode = 401;
    next(err);
  }
  req.user = payload;
  next();
};
