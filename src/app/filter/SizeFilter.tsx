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
        onSelectionChange={setSelectedSizes}
        items={sizes}
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
export default SizeFilter;