import { useEffect, useRef, useState } from "react";

function getInitials(name) {
  if (!name) {
    return "SR";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Sidebar({
  paths,
  selectedPathId,
  onSelectPath,
  onLogout,
  onSaveNickname,
  savingNickname,
  user
}) {
  // Track whether the profile dropdown is visible.
  const [menuOpen, setMenuOpen] = useState(false);
  // Track whether the nickname modal is open.
  const [nicknameModalOpen, setNicknameModalOpen] = useState(false);
  // Local input state lets the user edit a nickname before sending it to the backend.
  const [nickname, setNickname] = useState(user?.nickname || "");
  const menuRef = useRef(null);

  useEffect(() => {
    // Sync the input when user data changes after login or nickname update.
    setNickname(user?.nickname || "");
  }, [user?.nickname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the menu when the user clicks anywhere outside the profile area.
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.nickname || user?.name || "Learner";

  const handleOpenNickname = () => {
    // Reset the input to the saved value before opening the modal.
    setMenuOpen(false);
    setNickname(user?.nickname || "");
    setNicknameModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Let Dashboard handle the API call so profile state stays centralized there.
    await onSaveNickname(nickname);
    setNicknameModalOpen(false);
  };

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-top" ref={menuRef}>
          <div className="sidebar-profile-summary">
            <button
              className="profile-trigger"
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label="Open profile menu"
            >
              {getInitials(displayName)}
            </button>

            <div>
              <p className="sidebar-profile-label">Welcome back</p>
              <h2 className="sidebar-profile-name">{displayName}</h2>
            </div>
          </div>

          {menuOpen ? (
            <div className="profile-menu">
              <strong>{displayName}</strong>
              {user?.email ? <p>{user.email}</p> : null}
              <button className="profile-menu-action" type="button" onClick={handleOpenNickname}>
                Set Nickname
              </button>
              <button className="profile-logout" type="button" onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>

        <h2 className="sidebar-section-title">Previous Learning Paths</h2>

        <div className="sidebar-paths">
          {paths.length ? (
            paths.map((path) => {
              // Show progress in the sidebar so users can quickly choose the right roadmap.
              const completedSteps = path.steps?.filter((step) => step.completed).length || 0;
              const totalSteps = path.steps?.length || 0;

              return (
                <button
                  key={path._id}
                  className={`sidebar-path-button ${
                    selectedPathId === path._id ? "is-active" : ""
                  }`}
                  type="button"
                  onClick={() => onSelectPath(path._id)}
                >
                  <span className="sidebar-path-goal">{path.goal}</span>
                  <span className="sidebar-path-meta">
                    {completedSteps} / {totalSteps} steps completed
                  </span>
                </button>
              );
            })
          ) : (
            <div className="sidebar-empty">
              Your saved paths will appear here once you generate one.
            </div>
          )}
        </div>
      </aside>

      {nicknameModalOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="nickname-title">
            <div className="modal-header">
              <div>
                <span className="eyebrow">Profile</span>
                <h3 id="nickname-title">Set Nickname</h3>
              </div>
              <button
                className="modal-close"
                type="button"
                onClick={() => setNicknameModalOpen(false)}
                aria-label="Close nickname modal"
              >
                ×
              </button>
            </div>

            <form className="modal-form" onSubmit={handleSubmit}>
              <input
                className="goal-input"
                type="text"
                placeholder="Enter your nickname"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                maxLength={30}
                disabled={savingNickname}
              />

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setNicknameModalOpen(false)}
                  disabled={savingNickname}
                >
                  Cancel
                </button>
                <button className="primary-button" type="submit" disabled={savingNickname}>
                  {savingNickname ? "Saving..." : "Save Nickname"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Sidebar;
