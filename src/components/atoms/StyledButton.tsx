export function StyledButton({ children, className, ...props }: any) {
  return (
    <button
      {...props}
      className={`h-10 px-4 rounded-md font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition ${
        className || ''
      }`}
    >
      {children}
    </button>
  );
}
