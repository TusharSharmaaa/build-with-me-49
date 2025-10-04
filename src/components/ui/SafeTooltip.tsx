import * as React from "react";

type Props = { content?: React.ReactNode; children: React.ReactElement };

export function SafeTooltip({ content, children }: Props) {
  return React.cloneElement(children, {
    title: typeof content === "string" ? content : undefined,
  });
}
