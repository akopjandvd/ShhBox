import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <<< új

export default function Navbar({ onLogout }) {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = token.split('.')[1];
    try {
      const decoded = JSON.parse(atob(payload));
      setUsername(decoded.sub);
    } catch (e) {
      console.error('Invalid token', e);
    }
  }, []);

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center shadow-md">
      <div className="text-white text-lg font-bold">
        ShhBox
      </div>
      <div className="flex items-center gap-4">
        {username && (
          <span className="text-white text-sm">
            Logged in as <span className="font-semibold">{username}</span>
          </span>
        )}
        {username && (
          <button
            onClick={onLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
