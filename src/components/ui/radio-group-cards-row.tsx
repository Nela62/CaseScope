"use client";

import { useState } from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export default function RadioGroupCardsRow({
  options,
  label,
  onChange,
}: {
  options: string[];
  label: string;
  onChange: (option: string) => void;
}) {
  const [option, setOption] = useState(options[0]);

  return (
    <fieldset aria-label={label}>
      <div className="flex items-center justify-between">
        <div className="text-sm/6 font-semibold text-gray-900">{label}</div>
      </div>

      <RadioGroup.Root
        value={option}
        onValueChange={(option) => {
          setOption(option);
          onChange(option);
        }}
        className="mt-2 flex flex-wrap gap-3"
      >
        {options.map((option) => (
          <RadioGroup.Item
            key={option}
            value={option}
            className={cn(
              "cursor-pointer focus:outline-hidden",
              "flex items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 uppercase ring-1 ring-gray-300 hover:bg-gray-50 data-[state=checked]:bg-gray-600 data-[state=checked]:text-white data-[state=checked]:ring-0 data-[state=checked]:hover:bg-gray-500",
              "text-xs w-fit"
            )}
          >
            {option}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </fieldset>
  );
}
