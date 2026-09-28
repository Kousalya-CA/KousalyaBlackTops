import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setError("Can't reach the server. Start it with: npm run dev --prefix server"));
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
  };

  // Show name input form if user hasn't entered their name yet
  if (!userName) {
    return (
      <main className="page">
        <div className="name-input-container">
          <h2>Welcome!</h2>
          <p>Please enter your name to continue</p>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              className="name-input"
              placeholder="Enter your name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="submit-btn">Continue</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <h1>{message ? `${userName}, ${message}` : "Loading..."}</h1>
      )}
    </main>
  );
}
