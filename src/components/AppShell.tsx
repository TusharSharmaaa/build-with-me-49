import { ReactNode } from "react";
import { Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border safe-area-top">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-screen-xl">
          <h1 className="text-xl font-semibold text-foreground">AI Tools List</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/search")}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>
    </div>
  );
}
