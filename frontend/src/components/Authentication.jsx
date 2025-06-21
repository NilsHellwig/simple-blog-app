import { useState } from "react";

function Authentication({ setLoggedInUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loginMode, setLoginMode] = useState(true);

  const switchLoginMode = () => {
    setLoginMode(!loginMode);
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form id="login-form" onSubmit={onSubmit}>
      <div id="login-form-switch" onClick={switchLoginMode}>
        Switch to {loginMode ? "Registration" : "Login"}
      </div>

      {!loginMode && <input type="text" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />}

      <input type="text" placeholder="Username" required minLength="6" maxLength="30" value={username} onChange={(e) => setUsername(e.target.value)} />

      <input type="password" placeholder="Password" required minLength="6" maxLength="30" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button type="submit">{loginMode ? "Login" : "Register"}</button>
    </form>
  );
}

export default Authentication;
