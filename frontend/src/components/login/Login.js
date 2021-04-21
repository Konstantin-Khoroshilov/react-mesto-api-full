import React from "react";

function Login({ onLoginUser }) {
  function onSubmit(evt) {
    evt.preventDefault();
    onLoginUser();
  }
  return (
    <div
      className="login"
      onSubmit={onSubmit}
    >
      <form className="auth-form">
        <h2 className="auth-form__title">Вход</h2>
        <input type="email" className="auth-form__field" placeholder="Email" />
        <input type="password" className="auth-form__field" placeholder="Пароль" />
        <button type="submit" className="auth-form__button">Войти</button>
      </form>
    </div>
  );
}
export default Login;