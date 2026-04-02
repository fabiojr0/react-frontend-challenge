import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<ComponentProps<"select">, "onChange"> & {
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
};

function Select({
  className,
  options,
  placeholder,
  onChange,
  ref,
  ...props
}: SelectProps) {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export { Select };
export type { SelectProps, SelectOption };
