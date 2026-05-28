import React from 'react';

export interface FormWrapperProps {
  children: React.ReactNode;
  onSubmit?: () => void;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ children, onSubmit }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {children}
    </form>
  );
};

export default FormWrapper;
