import * as RadioGroup from '@radix-ui/react-radio-group';
export function StyledRadio({ options, value, onChange }: any) {
  return (
    <RadioGroup.Root className="flex gap-4" value={value} onValueChange={onChange}>
      {options.map((opt: any) => (
        <div key={opt.value} className="flex items-center gap-2">
          <RadioGroup.Item
            value={opt.value}
            id={opt.value}
            className="w-4 h-4 border rounded-full data-[state=checked]:bg-blue-600"
          />
          <label htmlFor={opt.value}>{opt.label}</label>
        </div>
      ))}
    </RadioGroup.Root>
  );
}
