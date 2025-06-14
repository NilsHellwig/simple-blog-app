function Authentication(loginMode) {
  return (
    <form id="login-form">
      <div id="login-form-switch">Switch to {loginMode ? "registration" : "login"}</div>
      <input type="text" placeholder="Username" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">{loginMode ? "Login" : "Register"}</button>
    </form>
  );
}

export default Authentication;
