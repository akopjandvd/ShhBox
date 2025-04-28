const API_BASE_URL = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function listFiles() {
  const response = await fetch(`${API_BASE_URL}/files`, {
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching files: ${response.statusText}`);
  }
  return await response.json();
}

export async function uploadFile(formData) {
  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders()
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`File upload failed: ${response.statusText}`);
  }
  return await response.text();
}

export async function deleteFile(id) {
  const response = await fetch(`${API_BASE_URL}/files/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  });

  if (!response.ok) {
    throw new Error(`File deletion failed: ${response.statusText}`);
  }
}
