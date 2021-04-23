const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((e) => {
      if (e.code === 11000) {
        const err = new Error('Пользователь с данным email уже зарегистрирован');
        err.statusCode = 409;
        next(err);
      }
      next(e);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('Данные по запросу не найдены'))
    .then((user) => { res.send(user); })
    .catch((e) => {
      if (e.message === 'Данные по запросу не найдены') {
        e.statusCode = 404;
        next(e);
      } else if (e.name === 'CastError') {
        const err = new Error('Переданы некорректные данные');
        err.statusCode = 400;
        next(err);
      }
      next(e);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => { res.send(users); })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (avatar) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    )
      .then((user) => res.send(user))
      .catch(next);
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'strong-protection',
        { expiresIn: '7d' }, // токен будет просрочен через неделю после создания
      );
        // вернём токен
      res.send({ token });
    })
    .catch(() => {
      const err = new Error('Неверный email или пароль');
      err.statusCode = 401;
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(new Error('Данные по запросу не найдены'))
    .then((user) => res.send({ data: user }))
    .catch((e) => {
      if (e.message === 'Данные по запросу не найдены') {
        e.statusCode = 404;
        next(e);
      } else if (e.name === 'CastError') {
        const err = new Error('Переданы некорректные данные');
        err.statusCode = 400;
        next(err);
      }
      next(e);
    });
};
