import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId") || "");
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setError("Can't reach the server. Start it with: npm run dev --prefix server"));
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetch("/api/session", {
        headers: { Authorization: `Bearer ${sessionId}` }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Invalid session");
          return res.json();
        })
        .then((data) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem("sessionId");
          setSessionId("");
        });
    }
  }, [sessionId]);

  useEffect(() => {
    if (user?.isAdmin) {
      fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${sessionId}` }
      })
        .then((res) => res.json())
        .then((data) => setUsers(data.users))
        .catch(() => {});
    }
  }, [user, sessionId]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });

      if (!res.ok) {
        const data = await res.json();
        setLoginError(data.error || "Login failed");
        return;
      }

      const data = await res.json();
      setSessionId(data.sessionId);
      setUser(data.user);
      localStorage.setItem("sessionId", data.sessionId);
      setShowLogin(false);
      setLoginUsername("");
      setLoginPassword("");
    } catch (err) {
      setLoginError("Network error");
    }
  };

  const handleLogout = async () => {
    if (sessionId) {
      await fetch("/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionId}` }
      });
    }
    localStorage.removeItem("sessionId");
    setSessionId("");
    setUser(null);
  };

  const handleUpdateMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("/api/admin/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`
        },
        body: JSON.stringify({ message: newMessage })
      });

      if (res.ok) {
        setMessage(newMessage);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Failed to update message:", err);
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
        <>
          <div className="user-status">
            {user ? (
              <div>
                <span>Logged in as: <strong>{user.username}</strong> {user.isAdmin && <span className="admin-badge">ADMIN</span>}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="login-btn">Admin Login</button>
            )}
          </div>

          <h1>{message ? `${userName}, ${message}` : "Loading..."}</h1>

          {showLogin && !user && (
            <div className="login-modal">
              <div className="login-form-container">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                  <input
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    autoFocus
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  {loginError && <p className="error">{loginError}</p>}
                  <div className="login-actions">
                    <button type="submit">Login</button>
                    <button type="button" onClick={() => setShowLogin(false)}>Cancel</button>
                  </div>
                </form>
                <p className="login-hint">Default admin: admin/admin123</p>
              </div>
            </div>
          )}

          {user?.isAdmin && (
            <div className="admin-panel">
              <h2>Admin Panel</h2>

              <div className="admin-section">
                <h3>Update Message</h3>
                <form onSubmit={handleUpdateMessage}>
                  <input
                    type="text"
                    placeholder="New greeting message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit">Update Message</button>
                </form>
              </div>

              <div className="admin-section">
                <h3>Users ({users.length})</h3>
                <ul className="users-list">
                  {users.map((u) => (
                    <li key={u.id}>
                      {u.username} {u.isAdmin && <span className="admin-badge">ADMIN</span>}
                      <span className="user-created">Created: {new Date(u.createdAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}
