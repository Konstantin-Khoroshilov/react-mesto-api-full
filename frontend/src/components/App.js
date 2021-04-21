import React from "react";
import Header from "./header/Header";
import Main from "./main/Main";
import Footer from "./footer/Footer";
import ImagePopup from "./imagePopup/ImagePopup";
import api from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import loadErrorImage from "../images/load-error.gif";
import EditProfilePopup from "./editProfilePopup/EditProfilePopup";
import EditAvatarPopup from "./editAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "./addPlacePopup/AddPlacePopup";
import Register from "./register/Register";
import Login from "./login/Login";
import { Route, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "./protectedRoute/ProtectedRoute";
import InfoTooltip from "./infoTooltip/InfoTooltip";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    ""
  );
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );
  const [isImageViewerPopupOpen, setIsImageViewerPopupOpen] = React.useState(
    false
  );
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false); 
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(true);
  const [isRegistered, setIsRegistered] = React.useState(false);

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        setCurrentUser({
          name: "Не удалось загрузить имя пользователя",
          about: "Не удалось загрузить должность пользователя",
          avatar: loadErrorImage,
        });
        console.log(err);
      });
  }, []);
  const [cards, setCards] = React.useState([]);
  React.useEffect(() => {
    //загружаем с сервера начальные карточки
    api
      .getInitialCards()
      .then((data) => {
        setCards(data);
        setCardsLoadStatus("success");
      })
      .catch((err) => {
        console.log(err);
        setCardsLoadStatus("fail");
      });
  }, []);
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleDeleteClick(card) {
    api.deleteCard(card._id).then((newCard) => {
      // Формируем новый массив на основе имеющегося, подставляя в него новую карточку
      const newCards = cards.filter((item) => {
        return item._id !== card._id;
      });
      setCards(newCards)
      .catch((error) => console.log(error));
    });
  }
  const [cardsLoadStatus, setCardsLoadStatus] = React.useState("inProcess");
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsImageViewerPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
  }
  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImageViewerPopupOpen(true);
  }
  function handleUpdateAvatar(link) {
    api
      .updateAvatar(link)
      .then((userInfo) => {
        setCurrentUser(userInfo);
        closeAllPopups();
      })
      .catch((error) => console.log(error));
  }
  function handleUpdateUser({ name, about }) {
    api
      .updateUserInfo(name, about)
      .then((userInfo) => {
        setCurrentUser({
          name: userInfo.name,
          about: userInfo.about,
          avatar: userInfo.avatar,
        });
        closeAllPopups();
      })
      .catch((error) => console.log(error));
  }
  function handleAddPlaceSubmit({ name, link }) {
    api
      .addNewCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => console.log(error));
  }
  function handleRegisterUser() {
    console.log('user is registered');
    setIsRegistered(false);
    setIsInfoTooltipOpen(true);
  }
  function handleLoginUser(evt) {
    console.log('user is logined');
  }
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Header />
        <Switch>
          <ProtectedRoute
            path exact ="/"
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleDeleteClick}
            cardsLoadStatus={cardsLoadStatus}
            cards={cards}
          />
        <Route path="/sign-up">
          <Register onRegisterUser={handleRegisterUser} />
        </Route>
        <Route path="/sign-in">
          <Login onLoginUser = {handleLoginUser}/>
        </Route>
        <Route>
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
        </Route>
        </Switch>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup
          isOpen={isImageViewerPopupOpen}
          card={selectedCard}
          onClose={closeAllPopups}
        />
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          registered={isRegistered}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
