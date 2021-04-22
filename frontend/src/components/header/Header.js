import React from "react";
import { Link } from 'react-router-dom';  
import logo from "../../images/logo.svg";

function Header({ currentPath, currentUser, handleLogOutClick }) {
  if (currentPath.includes('sign-in')) {
    return (
      <header className="header">
        <img className="header__logo" alt="Место Россия" src={logo} />
        <Link to="/sign-up" className="header__link">Регистрация</Link>
      </header>
    );
  } else if (currentPath.includes('sign-up')) {
    return (
      <header className="header">
        <img className="header__logo" alt="Место Россия" src={logo} />
        <Link to="/sign-in" className="header__link">Войти</Link>
      </header>
    );
  }
    return (
      <header className="header">
        <img className="header__logo" alt="Место Россия" src={logo} />
        <div>
          <p className="header__text">{currentUser.email}</p>
          <Link to="/sign-in" className="header__link header__link_type_logout" onClick={handleLogOutClick}>Выйти</Link>
        </div>
      </header>
    );
}
export default Header;
