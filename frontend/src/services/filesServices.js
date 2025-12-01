const API_BASE_URL = "http://localhost:8081";

async function handleResponse(res) {
  if (!res.ok) {
    let msg = `Error al subir archivo (${res.status})`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
      if (data?.error) msg = data.error;
    } catch (_) {
    }
    throw new Error(msg);
  }
  return res.json();
}


export async function uploadFile(file) {
  const token = localStorage.getItem("auth_token"); 

  const formData = new FormData();
  formData.append("file", file); 
  const res = await fetch(`${API_BASE_URL}/api/files/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  return handleResponse(res);
}
