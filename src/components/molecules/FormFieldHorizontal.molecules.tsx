import Label from '@/components/atoms/StyledLabel.atom';
import { StyledInput } from '@/components/atoms/StyledInput';

export default function HorizontalField({ label, ...props }) {
  return (
    <div className="flex items-center space-x-3">
      <Label>{label}</Label>
      <StyledInput {...props} />
    </div>
  );
}
