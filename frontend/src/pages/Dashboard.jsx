import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GoalForm from "../components/GoalForm";
import Navbar from "../components/Navbar";
import PathCard from "../components/PathCard";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function decodeToken(token) {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalizedPayload));
  } catch {
    return null;
  }
}

function Dashboard() {
  const [paths, setPaths] = useState([]);
  const [selectedPathId, setSelectedPathId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = useMemo(() => {
    const decoded = decodeToken(token || "");

    return {
      name: decoded?.name || decoded?.user?.name || "Learner",
      email: decoded?.email || decoded?.user?.email || ""
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchPaths = async () => {
    try {
      setPageLoading(true);
      const response = await API.getLearningPaths();
      const fetchedPaths = Array.isArray(response.data) ? response.data : [];

      setPaths(fetchedPaths);
      setSelectedPathId((currentId) => {
        if (currentId && fetchedPaths.some((path) => path._id === currentId)) {
          return currentId;
        }

        return fetchedPaths[0]?._id || null;
      });
    } catch (error) {
      console.error("Fetch paths error:", error);
      alert(error.response?.data?.error || "Failed to fetch learning paths");
    } finally {
      setPageLoading(false);
    }
  };

  const handleCreatePath = async (goal) => {
    try {
      setLoading(true);
      const response = await API.createLearningPath({ goal });
      const newPath = response.data;

      setPaths((currentPaths) => [newPath, ...currentPaths]);
      setSelectedPathId(newPath?._id || null);
    } catch (error) {
      console.error("Create path error:", error);
      alert(error.response?.data?.error || "Failed to create learning path");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStep = async (pathId, stepIndex) => {
    try {
      const response = await API.completeStep(pathId, stepIndex);
      const updatedPath = response.data;

      setPaths((currentPaths) =>
        currentPaths.map((path) => (path._id === pathId ? updatedPath : path))
      );
    } catch (error) {
      console.error("Complete step error:", error);
      alert(error.response?.data?.error || "Failed to update step");
    }
  };

  const handleDeletePath = async (pathId) => {
    try {
      await API.deleteLearningPath(pathId);

      setPaths((currentPaths) => {
        const updatedPaths = currentPaths.filter((path) => path._id !== pathId);

        setSelectedPathId((currentId) => {
          if (currentId !== pathId) {
            return currentId;
          }

          return updatedPaths[0]?._id || null;
        });

        return updatedPaths;
      });
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.error || "Failed to delete learning path");
    }
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  const selectedPath =
    paths.find((path) => path._id === selectedPathId) || paths[0] || null;

  return (
    <div className="dashboard-shell">
      <Sidebar
        paths={paths}
        selectedPathId={selectedPath?._id || null}
        onSelectPath={setSelectedPathId}
        onLogout={handleLogout}
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
              <p>
                Start by creating your first learning path {"\u{1F680}"}
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
