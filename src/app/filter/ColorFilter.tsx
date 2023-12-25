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

  const handleSelectionChange = (keys: any) => {
    // console.log(keys)
    let selectedStatusesArray: string[] = []
    if (keys){
      keys.forEach((item: any) => {
        // console.log('item', item)
        selectedStatusesArray.push(item);
      });
    }
    setSelectedColors(selectedStatusesArray);
  };

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
        onSelectionChange={(keys) => handleSelectionChange(keys)}
        items={colors}
      >
        {(item) => (
          <DropdownItem key={item.id}>
            {item.name}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
export default ColorFilter;