import { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { BottomTabs } from "./BottomTabs";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="container mx-auto px-4 py-6 max-w-screen-xl mb-20">
        {children}
      </main>
      <BottomTabs />
    </div>
  );
}
