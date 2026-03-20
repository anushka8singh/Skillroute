import { useState } from "react";

function GoalForm({ onCreatePath, loading }) {
  const [goal, setGoal] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!goal.trim()) {
      alert("Please enter a learning goal");
      return;
    }

    onCreatePath(goal);
    setGoal("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "24px" }}>
      <h2>Create a Learning Path</h2>

      <input
        type="text"
        placeholder="Enter your goal (e.g. Learn React)"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "10px",
          marginBottom: "12px"
        }}
      />

      <br />

      <button type="submit" disabled={loading}>
        {loading ? "Generating..." : "Generate Path"}
      </button>
    </form>
  );
}

export default GoalForm;