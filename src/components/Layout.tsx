import { ReactNode } from "react";
import { AppShell } from "./AppShell";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-3 max-w-screen-xl space-y-3">
        {children}
      </div>
      <BottomNav />
    </AppShell>
  );
}