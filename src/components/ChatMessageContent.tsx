type Props = {
  question?: string;
  answer?: string;
};

export default function ChatMessageContent({ question, answer }: Props) {
  return (
    <div className="space-y-2">
      <div className="bg-yellow-100 p-3 rounded">{question}</div>
      <div className="bg-orange-100 p-3 rounded">{answer}</div>
    </div>
  );
}
