export const sendPrompt = async (content: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, type: "text" }),
  });
  if (!res.ok) throw new Error("Failed to fetch AI response");
  const { data } = await res.json();
  return data;
};
