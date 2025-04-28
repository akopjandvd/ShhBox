import { useState } from "react";

export default function Register({ onRegisterSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        setMessage('Registration successful! You can now log in.');
        setUsername('');
        setPassword('');
        if (onRegisterSuccess) onRegisterSuccess();  // opcionális callback
      } else if (response.status === 409) {
        setMessage('Username already exists.');
      } else {
        const errorText = await response.text();
        setMessage(`Registration failed: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred.');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
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
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">{message}</p>}
    </div>
  );
}
