const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', auth, getCards);
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), auth, deleteCard);
router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string()
      .required()
      .pattern(/(^https?:\/\/www\.[0-9a-z-]+\.[0-9a-z-]{2,}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]+)?$)|(^https?:\/\/[^www][0-9a-z-]+\.[0-9a-z-]{2,}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]+)?$)/),
  }),
}), auth, createCard);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), auth, likeCard);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
}), auth, dislikeCard);

module.exports = router;
