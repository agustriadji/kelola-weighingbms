import { StyledButton } from '../atoms/StyledButton';

export function SummaryStatusMolecule({ control, Controller }) {
  return (
    <Controller
      name="status"
      control={control}
      defaultValue="pending"
      render={({ field }) => (
        <p>
          <strong>Status:</strong> {field.value}
        </p>
      )}
    />
  );
}

export function SummaryInfoTransactionMolecule() {
  return (
    <>
      <p>
        <strong>Transaction ID:</strong> TRX-20250201-000123
      </p>
      <p>
        <strong>Entry Time:</strong> 2025-02-01 10:32
      </p>
    </>
  );
}

export function SummaryActionButton({ control, Controller }) {
  return (
    <>
      <StyledButton type="submit" className="bg-green-600 hover:bg-green-700">
        APPROVE & OPEN GATE
      </StyledButton>
      <StyledButton type="button" className="bg-red-600 hover:bg-red-700">
        REJECT
      </StyledButton>
    </>
  );
}
