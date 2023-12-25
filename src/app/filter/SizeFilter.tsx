import { Size } from "@/pages/api/guest/size/Models";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import React from "react";
import { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface SizeFilterProps {
  sizes: Size[];
  setValue: UseFormSetValue<any>;
}

const SizeFilter: React.FC<SizeFilterProps> = ({
  sizes,
  setValue,
}) => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const selectedSizeValue = React.useMemo(
    () => Array.from(selectedSizes),
    [selectedSizes]
  );
  useEffect(() => {
    setValue('sizeIds', selectedSizeValue)
  }, [selectedSizeValue])

  const handleSelectionChange = (keys: any) => {
    // console.log(keys)
    let selectedStatusesArray: string[] = []
    if (keys){
      keys.forEach((item: any) => {
        // console.log('item', item)
        selectedStatusesArray.push(item);
      });
    }
    setSelectedSizes(selectedStatusesArray);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="w-40 border-2 p-3"> Filter Sizes </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Multiple selection example"
        variant="flat"
        closeOnSelect={false}
        disallowEmptySelection={false}
        selectionMode="multiple"
        selectedKeys={selectedSizes}
        onSelectionChange={(keys) => handleSelectionChange(keys)}
        items={sizes}
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
export default SizeFilter;