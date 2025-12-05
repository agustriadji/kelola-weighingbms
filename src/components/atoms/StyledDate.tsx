export function StyledDate(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="date"
      className={`h-10 px-3 rounded-md border border-gray-300 w-full focus:ring-2 focus:ring-blue-500 outline-none ${
        props.className || ''
      }`}
    />
  );
}