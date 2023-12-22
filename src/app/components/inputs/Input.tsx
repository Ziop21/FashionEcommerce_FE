import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";


interface InputProps {
  id: string;
  label: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<any>;
  errors: any;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  disabled,
  required,
  register,
  errors,
}) => {
  const isCheckbox = type === 'checkbox';
  const isColor = type === 'color';

  return (
    <div className={`w-full relative ${isCheckbox ? 'flex items-center' : ''}`}>
      {isColor ? (
        <>
          <div className="flex items-center border-2 rounded-md p-4">
            <label
              htmlFor={id}
              className={`cursor-text text-md duration-150 transform
                ${errors[id] ? 'text-rose-500' : 'text-slate-400'}
              `}
            >
              {label}
            </label>
            <input
              autoComplete="off"
              id={id}
              disabled={disabled}
              {...register(id, { required })}
              type={type}
              className={`ml-5 outline-none bg-white font-light
                transition disabled:opacity-70 disabled:cursor-not-allowed
                ${errors[id] ? 'border-rose-400' : 'border-slate-300'}
                ${errors[id] ? 'focus:border-rose-400' : 'focus:border-slate-500'}
              `}
            />
          </div>
        </>

      ) : (
        <>
          <input
            autoComplete="off"
            id={id}
            disabled={disabled}
            {...(type === "number" ? register(id, { required, valueAsNumber: true }) : register(id, { required }))}
            placeholder=""
            type={type}
            className={`peer w-full p-4 pt-6 outline-none bg-white font-light
          border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed
          ${errors[id] ? 'border-rose-400' : 'border-slate-300'}
          ${errors[id] ? 'focus:border-rose-400' : 'focus:border-slate-500'}
        `}
          />
          <label
            htmlFor={id}
            className={`absolute cursor-text text-md duration-150 transform
          -translate-y-3
          top-4
          left-4
          ${isCheckbox ? 'ml-2' : ''} // Thêm margin-left cho checkbox
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? 'text-rose-500' : 'text-slate-400'}
        `}
          >
            {label}
          </label>
          {errors[id] && (
            <div className="popup" style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid red', padding: '10px', borderRadius: '5px', zIndex: 999 }}>
              <span style={{ color: 'red' }}>{errors[id].message}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Input;
