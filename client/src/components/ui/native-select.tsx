import * as React from "react";
import { cn } from "@/lib/utils";

export type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          // Match your .input-arch shape + add missing text sizing and remove default outline
          "input-arch text-sm leading-none text-foreground outline-none focus:outline-none",
          // Make it feel like your other inputs
          "appearance-none pr-10",
          // Ensure consistent vertical centering in Safari/Chrome
          "py-0",
          // Custom chevron
          "bg-[length:14px_14px] bg-no-repeat bg-[right_12px_center]",
          "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%23a3a3a3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

NativeSelect.displayName = "NativeSelect";
