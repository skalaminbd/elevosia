/** Inline validation message under a field or fieldset. */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 text-xs text-destructive">
      {message}
    </p>
  );
}
