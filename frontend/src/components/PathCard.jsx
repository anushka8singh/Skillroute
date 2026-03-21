const RESOURCE_MAP = [
  { match: /react/i, url: "https://react.dev/learn" },
  { match: /javascript|js\b/i, url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { match: /node\.?js|node/i, url: "https://nodejs.org/en/learn" },
  { match: /express/i, url: "https://expressjs.com/" },
  { match: /mongodb|mongoose/i, url: "https://www.mongodb.com/docs/" },
  { match: /html/i, url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { match: /css/i, url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { match: /git|github/i, url: "https://docs.github.com/en/get-started" }
];

function resolveResourceUrl(step) {
  const rawValue = typeof step?.resource === "string" ? step.resource.trim() : "";

  // Use the saved URL directly when the backend already returned a valid link.
  if (/^https?:\/\/\S+$/i.test(rawValue)) {
    return rawValue;
  }

  // Fallback mapping protects the UI from broken or incomplete resource values.
  const sourceText = `${step?.title || ""} ${rawValue}`.trim();
  const mappedEntry = RESOURCE_MAP.find(({ match }) => match.test(sourceText));

  return mappedEntry?.url || "https://developer.mozilla.org/";
}

function PathCard({ path, onToggleStep, onDelete }) {
  // Defensive defaults keep the component stable even if data is temporarily incomplete.
  const steps = Array.isArray(path?.steps) ? path.steps : [];
  const completedSteps = steps.filter((step) => step.completed).length;
  // Progress is derived from step completion so the UI always matches backend data.
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
              checked={Boolean(step.completed)}
              // Send path id and step index back to the parent so it can call the API.
              onChange={() => onToggleStep(path._id, index)}
            />

            <div className="step-content">
              <div className="step-title-row">
                <strong>{step.title}</strong>
                <span className="step-badge">
                  {step.completed ? "Completed" : `Step ${index + 1}`}
                </span>
              </div>

              <a
                className="resource-link"
                href={resolveResourceUrl(step)}
                target="_blank"
                rel="noopener noreferrer"
                // Prevent the click from affecting the surrounding step label behavior.
                onClick={(event) => event.stopPropagation()}
              >
                Open Resource
              </a>
            </div>
          </label>
        ))}
      </div>
    </article>
  );
}

export default PathCard;
