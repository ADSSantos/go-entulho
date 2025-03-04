import React from "react";

interface CustomInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm sm:text-base font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`w-full p-3 text-base border-2 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <p className="mt-1 text-xs sm:text-sm text-red-600">{error}</p>}
    </div>
  );
};