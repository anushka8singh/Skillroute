function PathCard({ path }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "16px",
        borderRadius: "10px",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}
    >
      <h3>{path.goal}</h3>

      {path.steps && path.steps.length > 0 ? (
        <ul>
          {path.steps.map((step, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>{step.title}</strong>
              <br />
              <span>{step.resource}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No steps found.</p>
      )}
    </div>
  );
}

export default PathCard;