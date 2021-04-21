import React from "react";
import { Link } from "react-router-dom"

function Register({ onRegisterUser }) {
  function onSubmit(evt) {
    evt.preventDefault();
    onRegisterUser();
  }
  return (
    <div className="register">
      <form
        className="auth-form"
        onSubmit={onSubmit}
      >
        <h2 className="auth-form__title">Регистрация</h2>
        <input type="email" className="auth-form__field" placeholder="Email" />
        <input type="password" className="auth-form__field" placeholder="Пароль" />
        <button type="submit" className="auth-form__button">Зарегистрироваться</button>
        <Link to="/sign-in" className="auth-form__link">Уже зарегистрированы? Войти</Link>
      </form>
    </div>
  );
}
export default Register;