import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-2">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          {...props}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };