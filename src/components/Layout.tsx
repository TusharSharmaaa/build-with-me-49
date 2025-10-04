import { ReactNode } from "react";
import { AppShell } from "./AppShell";
import { BottomNav } from "./BottomNav";
import { AppBar } from "./AppBar";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showSearch?: boolean;
}

export function Layout({ children, title, showSearch = true }: LayoutProps) {
  useScrollRestoration();
  
  return (
    <AppShell>
      <AppBar title={title} showSearch={showSearch} />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-screen-xl space-y-4 md:space-y-6 mb-20">
        {children}
      </div>
      <BottomNav />
    </AppShell>
  );
}