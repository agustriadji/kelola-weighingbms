export async function fetchJSON(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch failed: ${res.status} ${res.statusText} - ${text}`);
  }

  return await res.json();
}
