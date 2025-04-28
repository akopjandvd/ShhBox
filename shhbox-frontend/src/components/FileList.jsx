
export default function FileList({ files, onDelete }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Uploaded Files</h2>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {files.map(file => (
            <li key={file.id} className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <div><strong>Name:</strong> {file.originalName}</div>
              <div><strong>Uploaded By:</strong> {file.uploadedBy}</div>
              <div><strong>Upload Time:</strong> {new Date(file.uploadTime).toLocaleString()}</div>
              <div className="mt-2 flex gap-4">
                <a
                  href={`/shhbox/api/files/download/${file.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Download
                </a>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => onDelete(file.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
