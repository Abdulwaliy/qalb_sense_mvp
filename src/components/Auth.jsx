import { useState } from "react";
import { signUp, login, logout } from "../services/authService.js";

export default function Auth({ user }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      alert("Account created!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert("Logged in!");
    } catch (err) {
      alert(err.message);
    }
  };

  if (user) {
    return (
      <div className="bg-white p-6 rounded shadow-md text-center">
        <p className="mb-4">Logged in as: {user.email}</p>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Authentication</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-2">
        <button
          onClick={handleSignUp}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>
        <button
          onClick={handleLogin}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}