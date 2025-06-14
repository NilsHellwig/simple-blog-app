import { CameraIcon, SignOutIcon } from "@phosphor-icons/react";

function Header({ loggedInUser }) {
  return (
    <header>
      <div id="logo">
        <CameraIcon size={32} weight="duotone" />
        <h1>Blogspace</h1>
      </div>
      {loggedInUser && (
        <div id="logout-button">
          <span>Logout {loggedInUser.name}</span>
          <SignOutIcon size={24} />
        </div>
      )}
    </header>
  );
}

export default Header;
