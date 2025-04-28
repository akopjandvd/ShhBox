import { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Válassz ki egy fájlt!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/shhbox/api/files/upload", {
        method: "POST",
        body: formData,
        headers: {
          "X-User": "testuser" // Ezt majd JWT-ből dinamikusan
        }
      });

      const text = await res.text();
      setMessage(text);
    } catch (err) {
      setMessage("Hiba történt a feltöltés során.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Fájl feltöltés</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Feltöltés
      </button>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
