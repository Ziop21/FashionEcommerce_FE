import { Color } from "@/pages/api/guest/color/Models";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import React from "react";
import { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface ColorFilterProps {
  colors: Color[];
  setValue: UseFormSetValue<any>;
}

const ColorFilter: React.FC<ColorFilterProps> = ({
  colors,
  setValue,
}) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const selectedColorValue = React.useMemo(
    () => Array.from(selectedColors),
    [selectedColors]
  );
  useEffect(() => {
    setValue('colorIds', selectedColorValue)
  }, [selectedColorValue])

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="w-40 border-2 p-3"> Filter Colors </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Multiple selection example"
        variant="flat"
        closeOnSelect={false}
        disallowEmptySelection={false}
        selectionMode="multiple"
        selectedKeys={selectedColors}
        onSelectionChange={setSelectedColors}
        items={colors}
      >
        {(item) => (
          <DropdownItem key={item.id} className={`${item.categoryIds?.length !== 0 ? 'pl-5' : ''}`}>
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
export default ColorFilter;