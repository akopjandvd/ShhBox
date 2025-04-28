import { useState, useEffect } from "react";

export default function UserInfo() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // JWT tokenből kiolvassuk a username-t (nem kell hozzá szerver)
    const payload = token.split('.')[1];
    try {
      const decoded = JSON.parse(atob(payload));
      setUsername(decoded.sub); // mert a `sub` mezőben van a username
    } catch (e) {
      console.error('Invalid token', e);
    }
  }, []);

  if (!username) return null;

  return (
    <div className="text-sm text-gray-700 dark:text-gray-300 text-center mt-2">
      Logged in as <span className="font-semibold">{username}</span>
    </div>
  );
}
