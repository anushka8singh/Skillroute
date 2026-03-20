function PathCard({ path, onToggleStep, onDelete }) {
  const steps = Array.isArray(path?.steps) ? path.steps : [];
  const completedSteps = steps.filter((step) => step.completed).length;
  const progressPercentage = steps.length
    ? Math.round((completedSteps / steps.length) * 100)
    : 0;

  return (
    <article className="path-card">
      <div className="path-card-header">
        <div>
          <span className="eyebrow">Selected Learning Path</span>
          <h3>{path.goal}</h3>
        </div>

        <button
          className="danger-button"
          type="button"
          onClick={() => onDelete(path._id)}
        >
          Delete
        </button>
      </div>

      <div className="progress-block">
        <div className="progress-copy">
          <span>Progress: {completedSteps} / {steps.length}</span>
          <span>{progressPercentage}% complete</span>
        </div>

        <div className="progress-track" aria-hidden="true">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="step-list">
        {steps.map((step, index) => (
          <label
            key={`${path._id}-${index}`}
            className={`step-item ${step.completed ? "is-complete" : ""}`}
          >
            <input
              type="checkbox"
              checked={step.completed}
              disabled={step.completed}
              onChange={() => onToggleStep(path._id, index)}
            />

            <div className="step-content">
              <div className="step-title-row">
                <strong>{step.title}</strong>
                <span className="step-badge">
                  {step.completed ? "Completed" : `Step ${index + 1}`}
                </span>
              </div>
              <p>{step.resource}</p>
            </div>
          </label>
        ))}
      </div>
    </article>
  );
}

export default PathCard;
