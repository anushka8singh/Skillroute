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

function Sidebar({ paths, selectedPathId, onSelectPath, onLogout, user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-top" ref={menuRef}>
        <button
          className="profile-trigger"
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Open profile menu"
        >
          {getInitials(user?.name)}
        </button>

        {menuOpen ? (
          <div className="profile-menu">
            <strong>{user?.name || "Learner"}</strong>
            {user?.email ? <p>{user.email}</p> : null}
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
  );
}

export default Sidebar;
