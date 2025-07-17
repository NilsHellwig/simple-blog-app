import { CameraIcon, SignOutIcon } from "@phosphor-icons/react";
function Header({ loggedInUser, setLoggedInUser }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedInUser(undefined);
  };

  return (
    <header>
      <div id="logo">
        <CameraIcon size={32} />
        <h1>Blogspace</h1>
      </div>
      {loggedInUser && (
        <div id="logout-button" onClick={handleLogout}>
          <span>Logout {loggedInUser.name}</span>
          <SignOutIcon size={24} />
        </div>
      )}
    </header>
  );
}

export default Header;
