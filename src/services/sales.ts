export const getSalesList = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/sales-reps`
  );
  if (!res.ok) throw new Error("Failed to fetch Sales");
  const { data } = await res.json();
  return data;
};
