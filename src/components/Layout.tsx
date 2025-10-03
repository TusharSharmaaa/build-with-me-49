import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen pb-16">
      <main className="container mx-auto px-4 py-6 max-w-screen-xl">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}