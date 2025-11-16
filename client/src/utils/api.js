// client/src/utils/api.js
const BASE_URL = "http://localhost:5001"; // <- use the PORT from your .env

export async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("sync_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    // your backend expects x-auth-token
    headers["x-auth-token"] = token;
  }

  // If sending FormData, do NOT set Content-Type (browser will set boundary)
  let body = options.body;
  const isForm = body instanceof FormData;
  if (isForm) {
    delete headers["Content-Type"];
  }

  const res = await fetch(BASE_URL + url, {
    ...options,
    headers,
    body: isForm ? body : body
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  // if response has no body (204) handle gracefully
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  } else {
    return null;
  }
}
