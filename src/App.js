import "./App.css";
import { useState } from "react";
import PollList from "./PollList";
import Login from "./Login";
import Register from "./Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <Register setShowRegister={setShowRegister} />

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
      <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  pauseOnHover
  theme="dark"
/>
    </div>
  );
}

export default App;