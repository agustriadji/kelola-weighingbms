import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
export function StyledCheckbox({ id, checked, onChange, label }: any) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox.Root
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="w-5 h-5 border rounded flex items-center justify-center data-[state=checked]:bg-blue-600"
      >
        <Checkbox.Indicator>
          <Check className="w-4 h-4 text-white" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
