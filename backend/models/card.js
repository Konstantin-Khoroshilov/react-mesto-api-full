const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /(^https?:\/\/www\.[0-9a-z-]+\.[0-9a-z-]{2,}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]+)?$)|(^https?:\/\/[^www][0-9a-z-]+\.[0-9a-z-]{2,}([/a-z0-9\-._~:?#[\]@!$&'()*+,;=]+)?$)/i.test(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
