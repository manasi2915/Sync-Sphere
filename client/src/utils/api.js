export async function apiRequest(url, options = {}) {
  const token = localStorage.getItem('sync_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // IMPORTANT: backend expects this exact header
  if (token) {
    headers['x-auth-token'] = token;
  }

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }

  return res.json();
}
