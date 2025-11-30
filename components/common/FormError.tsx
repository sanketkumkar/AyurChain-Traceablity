import React from 'react';

interface FormErrorProps {
  message?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-red-600 text-sm mt-1" role="alert">
      {message}
    </p>
  );
};