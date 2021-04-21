const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  login,
  createUser,
  getUserById,
} = require('../controllers/users');

usersRouter.get('/users', auth, getUsers);
usersRouter.get('/users/me', auth, getUser);
usersRouter.get('/users/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().required().length(24),
  }).unknown(true),
}), auth, getUserById);
usersRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), auth, updateUser);
usersRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .pattern(/(^https?:\/\/www\.[0-9a-z-]+\.[0-9a-z-]{2,}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]+)?$)|(^https?:\/\/[^www][0-9a-z-]+\.[0-9a-z-]{2,}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]+)?$)/),
  }),
}), auth, updateAvatar);
usersRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().pattern(/^\S*$/).required().min(8),
  }),
}), login);
usersRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .pattern(/(^https?:\/\/www\.[0-9a-z-]+\.[0-9a-z-]{2,}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]+)?$)|(^https?:\/\/[^www][0-9a-z-]+\.[0-9a-z-]{2,}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]+)?$)/),
    email: Joi.string().required().email(),
    password: Joi.string().pattern(/^\S*$/).required().min(8),
  }),
}), createUser);

module.exports = usersRouter;
