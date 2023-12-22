import { EOrderStatus } from "@/pages/api/admin/order/Models";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import React from "react";
import { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface StatusFilterProps {
  onChange: (statuses: EOrderStatus[]) => void;
 }

const StatusFilter: React.FC<StatusFilterProps> = ({
  onChange,
}) => {
  const [selectedStatuses, setSelectedStatuses] = useState<EOrderStatus[]>([]);
  const selectedStatusValue = React.useMemo(
    () => Array.from(selectedStatuses),
    [selectedStatuses]
  );
  useEffect(() => {
    onChange(selectedStatusValue);
  }, [selectedStatusValue])

  useEffect(() => {
    setSelectedStatuses(Object.values(EOrderStatus));
  }, [])

  const Statuses = Object.values(EOrderStatus).map(status => ({ key: status, label: status }));

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="w-40 border-2 p-3 border-primary"> Filter Statuses </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Multiple selection example"
        variant="flat"
        closeOnSelect={false}
        disallowEmptySelection={false}
        selectionMode="multiple"
        selectedKeys={selectedStatuses}
        onSelectionChange={setSelectedStatuses}
        items={Statuses}
      >
        {(item) => (
          <DropdownItem key={item.key}>
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
export default StatusFilter;