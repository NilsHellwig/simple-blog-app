import { CameraIcon, SignOutIcon } from "@phosphor-icons/react";

function Header({ loggedInUser, setLoggedInUser }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(undefined);
  };

  return (
    <header>
      <div id="logo">
        <CameraIcon size={32} weight="duotone" />
        <h1>Blogspace</h1>
      </div>
      {loggedInUser && (
        <button id="logout-button" type="button" onClick={handleLogout}>
          <span>Logout {loggedInUser.name}</span>
          <SignOutIcon size={24} />
        </button>
      )}
    </header>
  );
}

export default Header;
