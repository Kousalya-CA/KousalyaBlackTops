import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setError("Can't reach the server. Start it with: npm run dev --prefix server"));
  }, []);

  return (
    <main className="page">
      {error ? <p className="error">{error}</p> : <h1>{message || "Loading..."}</h1>}
    </main>
  );
}
