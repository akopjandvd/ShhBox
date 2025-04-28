import { useState } from "react";
import Register from "./Register";

export default function Login({ onLoginSuccess }) {
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        onLoginSuccess();
      } else {
        const errorText = await response.text();
        setMessage(`Login failed: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred.');
    }
  }

  if (showRegister) {
    return <Register onRegisterSuccess={() => setShowRegister(false)} />;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">{message}</p>}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowRegister(true)}
          className="text-green-600 hover:underline"
        >
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
}
