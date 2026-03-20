import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import GoalForm from "../components/GoalForm";
import PathCard from "../components/PathCard";

function Dashboard() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchPaths = async () => {
    try {
      const response = await API.get("/path");
      setPaths(response.data);
    } catch (error) {
      console.error("Fetch paths error:", error);
      alert(error.response?.data?.error || "Failed to fetch learning paths");
    }
  };

  const handleCreatePath = async (goal) => {
    try {
      setLoading(true);

      await API.post("/path", { goal });

      await fetchPaths();
    } catch (error) {
      console.error("Create path error:", error);
      alert(error.response?.data?.error || "Failed to create learning path");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaths();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}
      >
        <h1>SkillRoute Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <GoalForm onCreatePath={handleCreatePath} loading={loading} />

      <h2>Your Learning Paths</h2>

      {paths.length === 0 ? (
        <p>No learning paths yet. Create your first one.</p>
      ) : (
        paths.map((path) => <PathCard key={path._id} path={path} />)
      )}
    </div>
  );
}

export default Dashboard;