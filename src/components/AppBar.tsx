import { Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

interface AppBarProps {
  title?: string;
  showSearch?: boolean;
}

export function AppBar({ title = "AI Tools", showSearch = true }: AppBarProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-3 md:px-4 h-14 flex items-center justify-between max-w-screen-xl">
        <Link to="/" className="font-semibold text-lg">
          {title}
        </Link>
        
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/search")}
              className="h-9 w-9"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="h-9 w-9"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
