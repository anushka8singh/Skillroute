function Navbar({ title, subtitle }) {
  return (
    <header className="navbar">
      <span className="eyebrow">AI Learning Dashboard</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

export default Navbar;
