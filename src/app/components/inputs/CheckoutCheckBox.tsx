'use client'

import { FieldValues, UseFormRegister } from "react-hook-form";

interface CheckoutCheckBoxProps {
    id: string;
    label: string;
    disabled?: boolean;
    register: UseFormRegister<FieldValues>
    otherCheckboxIds?: string[];
}

const CheckoutCheckBox: React.FC<CheckoutCheckBoxProps> = ({
    id,
    label,
    disabled,
    register,
    otherCheckboxIds,
}) => {

    const handleCheckboxChange = () => {
        if (otherCheckboxIds && otherCheckboxIds.length > 0) {
            otherCheckboxIds.forEach((otherCheckboxId) => {
              const otherCheckbox = document.getElementById(otherCheckboxId) as HTMLInputElement | null;
              if (otherCheckbox) {
                otherCheckbox.checked = false;
              }
            });
          }
    }
    return ( 
        <div className="w-full flex flex-row gap-2 items-center border-sm border-2 m-1 border-l-slate-400 rounded-xl p-2">
            <input type="checkbox"
                id={id}
                disabled={disabled}
                onChange={() => {
                    handleCheckboxChange();
                    register(id)
                  }}
                placeholder=""
                className="cursor-pointer"
            />
            <label htmlFor={id} className="font-medium cursor-pointer">{label}</label>
        </div>
     );
}
 
export default CheckoutCheckBox;

