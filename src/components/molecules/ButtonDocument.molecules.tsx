import { StyledButton } from '../atoms/StyledButton';

interface ButtonDocumentActionProps {
  onClose?: () => void;
}

export function ButtonDocumentAction({ onClose }: ButtonDocumentActionProps) {
  return (
    <>
      <StyledButton type="submit" name="REJECT" className="btn-danger btn-sm">
        Reject
      </StyledButton>
      <StyledButton type="button" className="btn-secondary btn-sm" onClick={onClose}>
        Close
      </StyledButton>
      <StyledButton type="submit" className="btn-primary btn-sm">
        Tap/Save
      </StyledButton>
    </>
  );
}
