import Label from '@/components/atoms/StyledLabel.atom';
import { StyledInput } from '@/components/atoms/StyledInput';

export default function VerticalField({ label, ...props }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <StyledInput {...props} />
    </div>
  );
}
