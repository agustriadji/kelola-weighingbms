export function StyledButton({ children, className, ...props }: any) {
  return (
    <button
      {...props}
      className={className || 'btn-primary'}
    >
      {children}
    </button>
  );
}
