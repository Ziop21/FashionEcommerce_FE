import { Slider } from "@nextui-org/react";
import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface RatingRangeProps {
  setValue: UseFormSetValue<any>;
}

const RatingRange: React.FC<RatingRangeProps> = ({
  setValue,
}) => {
  const [selectedValue, setSelectedValue] = useState([0, 5]);

  return (
    <Slider
      label="Rating range"
      step={1}
      showSteps={true}
      minValue={0}
      maxValue={5}
      defaultValue={[0, 5]}
      value={selectedValue}
      onChange={(values) => {
        setSelectedValue(values)
        setValue('fromRating', values[0]);
        setValue('toRating', values[1]);
      }}
      className="max-w-md mt-5"
    />
  );
}
export default RatingRange;