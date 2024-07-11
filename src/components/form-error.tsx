import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type FormErrorProps = {
  message: string;
};

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      {/* <AlertTitle>Error</AlertTitle> */}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
