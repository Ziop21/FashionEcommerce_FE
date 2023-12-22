import { Slider } from "@nextui-org/react";
import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface PriceRangeProps {
  setValue: UseFormSetValue<any>;
}

const PriceRange: React.FC<PriceRangeProps> = ({
  setValue,
}) => {
  const [selectedValue, setSelectedValue] = useState([0, 3000000]);

  return (
    <Slider
      label="Price range"
      showTooltip={true}
      step={100}
      minValue={0}
      maxValue={3000000}
      defaultValue={[0, 3000000]}
      value={selectedValue}
      onChange={(values) => {
        setSelectedValue(values)
        setValue('fromPrice', values[0]);
        setValue('toPrice', values[1]);
      }}
      formatOptions={{ style: "currency", currency: "VND" }}
      className="max-w-md mt-5"
    />
  );
}
export default PriceRange;