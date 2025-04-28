import { useEffect, useState } from 'react';
import { listFiles, uploadFile, deleteFile } from './api';
import { useNavigate } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Login from './components/Login';
import Navbar from './components/Navbar'; //

function App() {
  const [files, setFiles] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  async function fetchFiles() {
    try {
      const data = await listFiles();
      setFiles(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchFiles();
    }
  }, [isLoggedIn]);

  function handleUploadSuccess() {
    fetchFiles();
  }

  function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this file?')) return;

    deleteFile(id)
      .then(() => fetchFiles())
      .catch(console.error);
  }

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">ShhBox Files</h1>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
        <FileList files={files} onDelete={handleDelete} />
      </div>
    </>
  );
}

export default App;
