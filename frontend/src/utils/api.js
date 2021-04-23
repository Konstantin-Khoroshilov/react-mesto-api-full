class Api {
  constructor(options) {
    this._initialCardsUrl = options.initialCardsUrl;
    this._getUserDataUrl = options.getUserDataUrl;
    this._updateUserDataUrl = options.updateUserDataUrl;
    this._addNewCardUrl = options.addNewCardUrl;
    this._deleteCardUrl = options.deleteCardUrl;
    this._setLikeUrl = options.setLikeUrl;
    this._removeLikeUrl = options.removeLikeUrl;
    this._updateAvatarUrl = options.updateAvatarUrl;
    this._signupUrl = options.signupUrl;
    this._signinUrl = options.signinUrl;
    this._authorization = options.authorization;
  }
  signup(email, password) {
    return fetch(this._signupUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(res);
    });
  }
  signin(email, password) {
    return fetch(this._signinUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(res);
    });
  }
  getInitialCards(token) {
    return fetch(this._initialCardsUrl, {
      headers: {
        authorization: token ? token : this._authorizationtoken,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(
        `Что-то пошло не так c загрузкой начальных карточек: ${res.status}`
      );
    });
  }
  getUserInfo(token) {
    return fetch(this._updateUserDataUrl, {
      headers: {
        authorization: token ? token : this._authorizationtoken,
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(
        `Что-то пошло не так c загрузкой данных пользователя: ${res.status}`
      );
    });
  }
  updateUserInfo(userName, userJob) {
    return fetch(this._updateUserDataUrl, {
      method: "PATCH",
      headers: {
        authorization: this._authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        about: userJob,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(
        `Что-то пошло не так c обновлением данных пользователя: ${res.status}`
      );
    });
  }
  addNewCard(name, link) {
    return fetch(this._addNewCardUrl, {
      method: "POST",
      headers: {
        authorization: this._authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(
        `Что-то пошло не так c добавлением новой карточки: ${res.status}`
      );
    });
  }
  deleteCard(cardId) {
    return fetch(`${this._deleteCardUrl}${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this._authorization,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(
        `Что-то пошло не так c удалением карточки: ${res.status}`
      );
    });
  }
  setLike(cardId) {
    return fetch(`${this._setLikeUrl}${cardId}/likes`, {
      method: "PUT",
      headers: {
        authorization: this._authorization,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(
        `Что-то пошло не так c проставлением лайка: ${res.status}`
      );
    });
  }
  removeLike(cardId) {
    return fetch(`${this._removeLikeUrl}${cardId}/likes`, {
      method: "DELETE",
      headers: {
        authorization: this._authorization,
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(
        `Что-то пошло не так c удалением лайка: ${res.status}`
      );
    });
  }
  changeLikeCardStatus(cardId, isLiked) {
    if (isLiked) {
      return this.removeLike(cardId);
    } else {
      return this.setLike(cardId);
    }
  }
  updateAvatar(link) {
    return fetch(this._updateAvatarUrl, {
      method: "PATCH",
      headers: {
        authorization: this._authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: link,
      }),
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      // если ошибка, отклоняем промис
      return Promise.reject(
        `Что-то пошло не так c обновлением аватара: ${res.status}`
      );
    });
  }
}

const apiData = {
  initialCardsUrl: "https://api.oneofthebest.students.nomoredomains.icu/cards",
  signupUrl: "https://api.oneofthebest.students.nomoredomains.icu/signup",
  signinUrl: "https://api.oneofthebest.students.nomoredomains.icu/signin",
  getUserDataUrl:
    "https://api.oneofthebest.students.nomoredomains.icu/users/me",
  updateUserDataUrl:
    "https://api.oneofthebest.students.nomoredomains.icu/users/me",
  addNewCardUrl: "https://api.oneofthebest.students.nomoredomains.icu/cards",
  deleteCardUrl: "https://api.oneofthebest.students.nomoredomains.icu/cards/",
  setLikeUrl:
    "https://api.oneofthebest.students.nomoredomains.icu/cards/",
  removeLikeUrl:
    "https://api.oneofthebest.students.nomoredomains.icu/cards/",
  updateAvatarUrl:
    "https://api.oneofthebest.students.nomoredomains.icu/users/me/avatar",
  authorization: localStorage.getItem("token"),
};

const api = new Api(apiData);

export default api;
