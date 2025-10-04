import * as React from "react";

// Safe no-op tooltip shims to avoid Radix dependency and hook/runtime issues
// Exports keep the same names used across the app so no other code needs changes

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const Tooltip: React.FC<{ children: React.ReactNode } & Record<string, any>> = ({ children }) => <>{children}</>;

type TriggerProps = React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean } & Record<string, any>;
const TooltipTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(({ asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    // just pass props to child without wrapping
    return React.cloneElement(children as React.ReactElement, { ...props, ref } as any);
  }
  return (
    <button ref={ref} {...props}>
      {children}
    </button>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

type ContentProps = React.ComponentPropsWithoutRef<"div"> & { side?: any; sideOffset?: any } & Record<string, any>;
const TooltipContent = React.forwardRef<HTMLDivElement, ContentProps>(({ className, children, ...props }, ref) => (
  <div ref={ref} role="tooltip" className={className} {...props}>
    {children}
  </div>
));
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
