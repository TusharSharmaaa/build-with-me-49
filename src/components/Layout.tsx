import { ReactNode } from "react";
import { AppShell } from "./AppShell";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <AppShell>
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-screen-xl space-y-4 md:space-y-6">
        {children}
      </div>
      <BottomNav />
    </AppShell>
  );
}