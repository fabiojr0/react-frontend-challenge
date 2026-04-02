import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

type LabelProps = ComponentProps<"label"> &
  VariantProps<typeof labelVariants>;

function Label({ className, ref, ...props }: LabelProps) {
  return (
    <label
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  );
}

export { Label };
export type { LabelProps };
