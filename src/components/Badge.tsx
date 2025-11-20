type BadgeProps = {
  text: string;
  color: string;
};

export default function Badge({ text, color="bg-blue-600" }: BadgeProps) {
  return (
    <span className={`${color} text-white px-2 py-1 text-xs rounded`}>{text}</span>
  )
}
