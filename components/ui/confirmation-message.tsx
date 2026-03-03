import React from 'react';
import { Alert, AlertTitle, AlertDescription } from './alert';

interface ConfirmationMessageProps {
  message: string;
  visible: boolean;
}

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({ message, visible }) => {
  if (!visible) return null;

  return (
    <Alert variant="default" data-testid="confirmation-message">
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ConfirmationMessage;
