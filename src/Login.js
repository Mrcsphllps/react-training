import { useState } from "react";

function Login({ setIsLoggedIn }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
  const response = await fetch("http://localhost:5000/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usernameOrEmail,
      password,
    }),
  });

  const data = await response.json();

  console.log("Login response:", data);

localStorage.setItem("token", data.accessToken);
const userResponse = await fetch("http://localhost:5000/api/users/me", {
  headers: {
    Authorization: `Bearer ${data.accessToken}`,
  },
});

const userData = await userResponse.json();

localStorage.setItem("user", JSON.stringify(userData));
setIsLoggedIn(true);

  alert("Login successful!");
} catch (error) {
  console.error("Login error:", error);
  alert("Login failed!");
}
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username or email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;