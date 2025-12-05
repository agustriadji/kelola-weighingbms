export function FieldRow({ label, ...props }) {
  return (
    <div className="flex items-center gap-3">
      <label className="w-40 text-sm">{label}</label>
      <input className="flex-1 h-9 border bg-white px-2 text-sm" {...props} />
    </div>
  );
}
