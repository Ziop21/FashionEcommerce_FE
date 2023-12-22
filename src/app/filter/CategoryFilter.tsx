import { Category } from "@/pages/api/guest/category/Models";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import React from "react";
import { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface CategoryFilterProps {
  categories: Category[];
  setValue: UseFormSetValue<any>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  setValue,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const selectedCategoryValue = React.useMemo(
    () => Array.from(selectedCategories),
    [selectedCategories]
  );
  useEffect(() => {
    setValue('categoryIds', selectedCategoryValue)
  }, [selectedCategoryValue])

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="w-40 border-2 p-3"> Filter Categories </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Multiple selection example"
        variant="flat"
        closeOnSelect={false}
        disallowEmptySelection={false}
        selectionMode="multiple"
        selectedKeys={selectedCategories}
        onSelectionChange={setSelectedCategories}
        items={categories}
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
export default CategoryFilter;