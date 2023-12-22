'use client'

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface CheckoutInputProps{
    id: string;
    label: string;
    type?: string;
    disabled?: boolean;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors
    onChange?: (value: string) => void;
}

const CheckoutInput: React.FC<CheckoutInputProps> = ({
  id,
  label,
  type,
  disabled,
  required,
  register,
  errors,
  onChange,
}) => {
    const isCheckbox = type === 'checkbox';
    const handleInputChange = (e) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };
  return (
    <div className={`w-full m-2 relative ${isCheckbox ? 'flex items-center ' : ''}`}>
      <input
        autoComplete="off"
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=""
        type={type}
        onChange={handleInputChange}
        className={`peer w-[90%] h-14 p-1 pl-5 pt-3 outline-none bg-white font-light text-sm items-center
          border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed
          ${errors[id] ? 'border-rose-400' : 'border-slate-300'}
          ${errors[id] ? 'focus:border-rose-400' : 'focus:border-slate-500'}
        `}
      />
      <label
        htmlFor={id}
        className={`absolute cursor-text text-sm  duration-150 transform
          -translate-y-3
          top-4
          left-4
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-3
          ${label ? 'scale-90' : ''}
          ${errors[id] ? 'text-rose-500' : 'text-slate-400' } 
        `}
      >
        {label}
      </label>
    </div>
  );
}
 
export default CheckoutInput;