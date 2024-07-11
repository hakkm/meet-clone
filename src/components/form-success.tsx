import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FormSuccessProps = {
  message: string;
};

export default function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null
  return (
    <Alert variant="success">
      <AlertCircle color="green" className="h-4 w-4" />
      {/* <AlertTitle>Error</AlertTitle> */}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
