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
import {
  Route,
  Switch,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
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
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [cards, setCards] = React.useState([]);
  const location = useLocation();
  const history = useHistory();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      api.getUserInfo(token)
        .then((user) => {
          setCurrentUser(user);
        })
        .then(() => {
          api.getInitialCards(token)
            .then((cards) => {
              setCards(cards);
              setCardsLoadStatus("success");
            })
        })
        setLoggedIn(true);
        history.push('/');
    }
  }, []);
  function handleCardLike(card) {
    const isLiked = card.likes.includes(currentUser._id, 0);
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
      setCards(newCards);
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
      .then((user) => {
        setCurrentUser(user);
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
  function handleRegisterUser({ email, password }) {
    api
      .signup(email, password)
      .then(() => {
        setIsRegistered(true);
        setIsInfoTooltipOpen(true);
        history.push("/sign-in");
      })
      .catch((res) => {
        setIsRegistered(false);
        setIsInfoTooltipOpen(true);
      });
  }
  async function handleLoginUser({ email, password }) {
    try {
      const tokenRequest = await api.signin(email, password);
      const token = await tokenRequest;
      const user = await api.getUserInfo(`Bearer ${token.token}`);
      const cards = await api.getInitialCards(`Bearer ${token.token}`);
      setCurrentUser(user);
      setCards(cards);
      setCardsLoadStatus("success");
      localStorage.setItem('token', `Bearer ${token.token}`);
      setLoggedIn(true);
      history.push('/');
    } catch(err) {
      console.log(err);
      setIsRegistered(false);
      setIsInfoTooltipOpen(true);
    }
  }

  function handleLogOutClick() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Header
          currentPath={location.pathname}
          currentUser={currentUser}
          handleLogOutClick={handleLogOutClick}
        />
        <Switch>
          <ProtectedRoute
            path
            exact="/"
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
            <Login onLoginUser={handleLoginUser} />
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
