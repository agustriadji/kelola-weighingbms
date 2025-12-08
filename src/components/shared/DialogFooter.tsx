export const DialogFooter = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`flex justify-end gap-3 p-6 border-t ${className}`}>{children}</div>;
};
