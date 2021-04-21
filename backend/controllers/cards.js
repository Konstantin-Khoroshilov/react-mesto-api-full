const Card = require('../models/card');

function errorHandler(e, next) {
  if (e.message === 'notFound') {
    const err = new Error('Данные по запросу не найдены');
    err.statusCode = 404;
    next(err);
  } else if (e.name === 'CastError') {
    const err = new Error('Переданы некоррекные данные');
    err.statusCode = 400;
    next(err);
  } else {
    const err = new Error('На сервере произошла ошибка');
    err.statusCode = 500;
    next(err);
  }
}

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => { res.send(cards); })
    .catch((e) => { errorHandler(e, next); });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new Error('notFound'))
    .then((card) => {
      if (String(card.owner) === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .orFail(new Error('notFound'))
          .then((deletedCard) => { res.send(deletedCard); })
          .catch((e) => { errorHandler(e, next); });
      } else {
        const err = new Error('Недостаточно прав для выполнения запроса');
        err.statusCode = 403;
        next(err);
      }
    })
    .catch((e) => { errorHandler(e, next); });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => { res.send(card); })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        const err = new Error('Переданы некоррекные данные');
        err.statusCode = 400;
        next(err);
      } else {
        const err = new Error('На сервере произошла ошибка');
        err.statusCode = 500;
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
).orFail(new Error('notFound'))
  .then((card) => { res.send(card.likes); })
  .catch((e) => { errorHandler(e, next); });

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).orFail(new Error('notFound'))
  .then((card) => { res.send(card.likes); })
  .catch((e) => { errorHandler(e, next); });
