import { useState, useRef } from "react";
import { uploadFile } from "../api";

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please choose a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMessage("");

    try {
      const result = await uploadFile(formData);
      setMessage(result);
      setFile(null);
      fileInputRef.current.value = "";
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setMessage("There was an error while uploading.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">File Upload</h2>
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
          setMessage("");
        }}
        className="mb-4 block w-full text-sm text-gray-500"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {message && (
        <p className={`mt-4 text-sm ${message.includes("error") ? "text-red-500" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
