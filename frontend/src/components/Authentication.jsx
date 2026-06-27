import { useState } from "react";
import { login, register } from "../api";

function Authentication({ setLoggedInUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMode, setLoginMode] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();
    if (loginMode) {
      login(username, password, setLoggedInUser);
    } else {
      register(username, password, setLoggedInUser);
    }
  };

  return (
    <form className="form-card" onSubmit={onSubmit}>
      <button id="auth-mode-switch" type="button" onClick={() => setLoginMode((prev) => !prev)}>
        Switch to {loginMode ? "Registration" : "Login"}
      </button>

      <input
        type="text"
        placeholder="Username"
        required
        minLength="6"
        maxLength="30"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        required
        minLength="6"
        maxLength="30"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">{loginMode ? "Login" : "Register"}</button>
    </form>
  );
}

export default Authentication;
