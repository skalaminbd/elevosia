import { CircleCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SuccessAlert({
  title,
  description,
}: {
  title: string;
  description?: string;
  onClose?: () => void;
}) {
  return (
    <Alert>
      <CircleCheck aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      {description ? (
        <AlertDescription>{description}</AlertDescription>
      ) : null}
    </Alert>
  );
}
