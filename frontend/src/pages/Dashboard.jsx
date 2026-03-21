import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GoalForm from "../components/GoalForm";
import Navbar from "../components/Navbar";
import PathCard from "../components/PathCard";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function decodeToken(token) {
  try {
    // JWTs store user information in the middle "payload" section.
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    // Convert URL-safe Base64 into normal Base64 before decoding it in the browser.
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalizedPayload));
  } catch {
    return null;
  }
}

function Dashboard() {
  const navigate = useNavigate();
  // paths stores all learning paths returned from the backend for this user.
  const [paths, setPaths] = useState([]);
  // selectedPathId controls which roadmap is shown in the main content area.
  const [selectedPathId, setSelectedPathId] = useState(null);
  // loading is used while the app is generating a new AI learning path.
  const [loading, setLoading] = useState(false);
  // pageLoading covers the first fetch so the dashboard can show a loading state.
  const [pageLoading, setPageLoading] = useState(true);
  // savingNickname prevents duplicate profile update requests.
  const [savingNickname, setSavingNickname] = useState(false);
  // Keep token in state so the UI can re-render immediately when profile data inside the JWT changes.
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const user = useMemo(() => {
    // Decode user details from the token instead of making a separate "get profile" request.
    const decoded = decodeToken(token);

    return {
      name: decoded?.name || "Learner",
      email: decoded?.email || "",
      nickname: decoded?.nickname || ""
    };
  }, [token]);

  const handleLogout = () => {
    // Removing the token logs the user out because protected routes depend on it.
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  const fetchPaths = async () => {
    try {
      setPageLoading(true);
      // The API service automatically attaches the JWT before this request is sent.
      const response = await API.getLearningPaths();
      const fetchedPaths = Array.isArray(response.data) ? response.data : [];

      setPaths(fetchedPaths);
      setSelectedPathId((currentId) => {
        // Keep the current selection if that path still exists after refreshing data.
        if (currentId && fetchedPaths.some((path) => path._id === currentId)) {
          return currentId;
        }

        // Otherwise default to the newest available path.
        return fetchedPaths[0]?._id || null;
      });
    } catch (error) {
      alert(error.response?.data?.error || "Failed to fetch learning paths");
    } finally {
      setPageLoading(false);
    }
  };

  const handleCreatePath = async (goal) => {
    try {
      setLoading(true);
      // Send the goal to the backend, where AI generates steps and MongoDB stores the path.
      const response = await API.createLearningPath({ goal });
      const newPath = response.data;

      // Update local state immediately so the UI feels responsive without a full refetch.
      setPaths((currentPaths) => [newPath, ...currentPaths]);
      setSelectedPathId(newPath?._id || null);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create learning path");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = async (pathId, stepIndex) => {
    try {
      // Backend returns the full updated path after toggling one embedded step.
      const response = await API.completeStep(pathId, stepIndex);
      const updatedPath = response.data;

      // Replace only the changed path so progress and checklist state stay in sync.
      setPaths((currentPaths) =>
        currentPaths.map((path) => (path._id === pathId ? updatedPath : path))
      );
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update step");
    }
  };

  const handleDeletePath = async (pathId) => {
    try {
      await API.deleteLearningPath(pathId);

      setPaths((currentPaths) => {
        const updatedPaths = currentPaths.filter((path) => path._id !== pathId);

        setSelectedPathId((currentId) => {
          // If the deleted path was selected, move the user to the next available path.
          if (currentId !== pathId) {
            return currentId;
          }

          return updatedPaths[0]?._id || null;
        });

        return updatedPaths;
      });
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete learning path");
    }
  };

  const handleSaveNickname = async (nickname) => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      alert("Please enter a nickname");
      return;
    }

    try {
      setSavingNickname(true);
      // Backend returns a fresh token because nickname is stored inside the JWT payload.
      const response = await API.updateNickname(trimmedNickname);

      // Save the new token in both localStorage and state so future requests and UI stay aligned.
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save nickname");
      throw error;
    } finally {
      setSavingNickname(false);
    }
  };

  useEffect(() => {
    // useEffect runs once when the dashboard first loads to fetch existing learning paths.
    fetchPaths();
  }, []);

  // Derive the selected path from state so Sidebar and PathCard stay synchronized.
  const selectedPath =
    paths.find((path) => path._id === selectedPathId) || paths[0] || null;

  return (
    <div className="dashboard-shell">
      <Sidebar
        paths={paths}
        selectedPathId={selectedPath?._id || null}
        onSelectPath={setSelectedPathId}
        onLogout={handleLogout}
        onSaveNickname={handleSaveNickname}
        savingNickname={savingNickname}
        user={user}
      />

      <main className="dashboard-main">
        <div className="dashboard-content">
          <Navbar
            title="SkillRoute"
            subtitle="Build focused learning paths with AI and track each step as you go."
          />

          <GoalForm onCreatePath={handleCreatePath} loading={loading} />

          {pageLoading ? (
            <section className="empty-state">
              <p>Loading your learning paths...</p>
            </section>
          ) : selectedPath ? (
            <PathCard
              path={selectedPath}
              onToggleStep={handleToggleStep}
              onDelete={handleDeletePath}
            />
          ) : (
            <section className="empty-state">
              <p>Start by creating your first learning path.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
