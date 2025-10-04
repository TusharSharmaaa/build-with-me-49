import { Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TopBar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border pt-safe">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between max-w-screen-xl">
        <h1 className="font-bold text-lg">AI Tools List</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/search")}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
