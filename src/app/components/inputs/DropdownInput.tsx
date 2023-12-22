"use client"
import React, { useState, useEffect } from 'react';
import { FieldErrors, FieldValues, UseFormRegister, useForm } from 'react-hook-form';

export interface Option {
  value: any,
  label: string
}

interface DropdownInputProps {
  id: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<any>;
  preValue?: any;
  errors: FieldErrors;
  options: Option[];
  getSearchValue?: (value: string) => void;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  id,
  label,
  disabled,
  required,
  register,
  preValue,
  errors,
  options,
  getSearchValue,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [shouldFocusSelect, setShouldFocusSelect] = useState(false);
  const [selectedValue, setSelectedValue] = useState(preValue);

  useEffect(() => {
    setSelectedValue(preValue);
  }, [preValue]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(e.target.value);
  };
  
  useEffect(() => {
      setFilteredOptions(options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase())))
  }, [options])

  useEffect(() => {
    if (shouldFocusSelect) {
      const selectElement = document.getElementById(id) as HTMLSelectElement | null;
      if (selectElement) {
        selectElement.focus();
      }
      setShouldFocusSelect(false);
    }
  }, [shouldFocusSelect]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilteredOptions(options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase())))
      setShouldFocusSelect(true);
      if (getSearchValue) 
        getSearchValue(searchTerm);
    }
  };

  return (
    <div className="w-full relative flex items-center">
      <div className="flex flex-grow w-full">
        <select
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          className={`peer w-full p-4 pt-6 outline-none bg-white font-light
            border-2 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed
            ${errors[id] ? 'border-rose-400' : 'border-slate-300'}
            ${errors[id] ? 'focus:border-rose-400' : 'focus:border-slate-500'}
          `}
          defaultValue={""}
          value={selectedValue}
          onChange={handleSelectChange}
        >
          <option value="">
            Select an option
          </option>
          {filteredOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="ml-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-full outline-none p-2 rounded-md border border-slate-300"
          disabled={disabled}
          onKeyDown={handleKeyDown}
        />
      </div>
      <label
        htmlFor={id}
        className={`absolute cursor-text text-md duration-150 transform
          -translate-y-3
          top-4
          left-4
          ml-2
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? 'text-rose-500' : 'text-slate-400'}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default DropdownInput;