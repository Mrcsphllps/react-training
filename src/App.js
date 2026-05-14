import "./App.css";
import { useState } from "react";
import PollList from "./PollList";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      <h1>Polls Frontend</h1>

      {isLoggedIn ? (
        <>
          <button className="delete-button" onClick={handleLogout}>
            Logout
          </button>

          <PollList />
        </>
      ) : showRegister ? (
        <>
          <Register />

          <button
  className="auth-toggle-button"
  onClick={() => setShowRegister(false)}
>
            Already have an account? Login
          </button>
        </>
      ) : (
        <>
          <Login setIsLoggedIn={setIsLoggedIn} />

          <button
  className="auth-toggle-button"
  onClick={() => setShowRegister(true)}
>
            Create an account
          </button>
        </>
      )}
    </div>
  );
}

export default App;