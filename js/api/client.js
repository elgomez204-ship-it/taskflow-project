const API_BASE_URL = "http://localhost:3000/api/v1/tasks";

async function request(path = "", options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Error de red al comunicarse con el servidor.");
  }

  return payload;
}

export function fetchTasks() {
  return request();
}

export function createTaskRequest(data) {
  return request("", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function updateTaskRequest(id, data) {
  return request(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}

export function deleteTaskRequest(id) {
  return request(`/${id}`, {
    method: "DELETE"
  });
}
