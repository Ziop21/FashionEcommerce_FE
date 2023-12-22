import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Cities } from "@/utils/City";

interface DropdownCheckoutProps {
  placeholder?: string;
  type?: string;
  code?: {city: number, districts: number, ward: number};
  onChange?: (selectedKey: number, name: string ) => void;
}

interface ItemType {
  code: string; 
  name: string; 
}

const DropdownCheckout: React.FC<DropdownCheckoutProps> = ({placeholder, type, code ,onChange }) => {

  const [selectedKey, setSelectedKey] = React.useState<React.Key | null>(null);
  const getCity = Cities.find(city => city.code === code?.city);
  const getDistricts = getCity?.districts.find(districts => districts.code === code?.districts);
  const City = Cities;
  const Districts = getCity ? getCity.districts : [];
  const Wards = getDistricts ? getDistricts.wards : [];

  const onSelectionChange = (key: React.Key) => {
    setSelectedKey(key);
    const selectedItem = (type === "province")
    ? City.find(item => item.code === Number(key))
    : (type === "district")
      ? getCity?.districts.find(item => item.code === Number(key))
      : Wards.find(item => item.code === Number(key));
  if (onChange && selectedItem) 
    if (onChange) {
      onChange(Number(key), selectedItem.name);
    }
  };

    return ( 
      <div className=" w-full h-auto m-[10px] relative text-xs  ">
        <Autocomplete
        size="sm"
        label=""
        variant="flat"
        hoverable="false"
        placeholder={placeholder}
        defaultItems= {(type == "province") ? City : ((type == "district") ? Districts : Wards) } 
        className="peer w-[89%] h-[80%] font-light items-center
         rounded-md transition"
        scrollShadowProps={{
          isEnabled: true  
        }}
        onSelectionChange={(key) => onSelectionChange(key)}

      >
        {(item) => <AutocompleteItem className="text-sm bg-slate-200 gap-0 " 
        key={item.code}
        >{item.name}
        </AutocompleteItem>}
      </Autocomplete>
      </div>
     );
}
 
export default DropdownCheckout;