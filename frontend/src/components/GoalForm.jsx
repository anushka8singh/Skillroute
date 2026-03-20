import { useState } from "react";

function GoalForm({ onCreatePath, loading }) {
  const [goal, setGoal] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedGoal = goal.trim();

    if (!trimmedGoal) {
      alert("Please enter a learning goal");
      return;
    }

    await onCreatePath(trimmedGoal);
    setGoal("");
  };

  return (
    <section className="goal-form-panel">
      <div className="goal-form-copy">
        <span className="eyebrow">Create Learning Path</span>
        <h2>What do you want to learn next?</h2>
        <p>Describe your goal and SkillRoute will generate a clear roadmap for you.</p>
      </div>

      <form className="goal-form" onSubmit={handleSubmit}>
        <input
          className="goal-input"
          type="text"
          placeholder="Enter your goal, for example: Learn React from scratch"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          disabled={loading}
        />

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
    </section>
  );
}

export default GoalForm;
