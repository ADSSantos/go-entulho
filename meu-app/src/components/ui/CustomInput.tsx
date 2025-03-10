import React from "react";

interface CustomInputProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  icon?: React.ReactNode; // Adicionando a propriedade icon
  inputClassName?: string; // Nova prop para classes do input
}

const CustomInput = ({
  label,
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  icon, // Recebendo a propriedade icon
  inputClassName,
}: CustomInputProps) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm sm:text-base font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full p-3 text-base border-2 ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
            icon ? "pl-10" : ""
          } ${inputClassName}`}  // Aplicando as classes do input
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default CustomInput;