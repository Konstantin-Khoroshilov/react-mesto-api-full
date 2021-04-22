import React from "react";

function Login({ onLoginUser }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleEmailChange(evt) {
    setEmail(evt.target.value);
  }
  function handlePasswordChange(evt) {
    setPassword(evt.target.value);
  }
  function onSubmit(evt) {
    evt.preventDefault();
    onLoginUser({ email, password });
  }
  return (
    <div className="login" onSubmit={onSubmit}>
      <form className="auth-form">
        <h2 className="auth-form__title">Вход</h2>
        <input
          type="email"
          onChange={handleEmailChange}
          className="auth-form__field"
          placeholder="Email"
        />
        <input
          type="password"
          onChange={handlePasswordChange}
          className="auth-form__field"
          placeholder="Пароль"
        />
        <button type="submit" className="auth-form__button">
          Войти
        </button>
      </form>
    </div>
  );
}
export default Login;
