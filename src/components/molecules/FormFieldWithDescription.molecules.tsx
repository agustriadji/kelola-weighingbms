import Label from '@/components/atoms/StyledLabel.atom';
import { StyledInput } from '@/components/atoms/StyledInput';
import Description from '@/components/atoms/StyledDescriptionInput.atom';

export default function FieldWithDescription({ label, description, ...props }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <StyledInput {...props} />
      {description && <Description>{description}</Description>}
    </div>
  );
}
