import React from "react";
import {Input} from "@nextui-org/react";

export default function DiscountCodeInput() {
  const [value, setValue] = React.useState("");

  return (
    <div className="w-full flex flex-col gap-2  ">
      <Input
        placeholder="Enter your discount code"
        variant="bordered"
        size="sm"
        value={value}
        onValueChange={setValue}
      />
      <p className="ml-3 text-small">Your discount: {value}</p>
    </div>
  );
}