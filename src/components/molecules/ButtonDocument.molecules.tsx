import { StyledButton } from '../atoms/StyledButton';

interface ButtonDocumentActionProps {
  onClose?: () => void;
}

export function ButtonDocumentAction({ onClose }: ButtonDocumentActionProps) {
  return (
    <>
      <StyledButton type="button" className="bg-red-600 hover:bg-red-700" onClick={onClose}>
        Close
      </StyledButton>
      <StyledButton type="submit" name="REJECT" className="bg-red-600 hover:bg-red-700">
        Reject
      </StyledButton>
      <StyledButton type="submit" className="bg-green-600 hover:bg-green-700">
        Save
      </StyledButton>
    </>
  );
}
