import { Home, Grid3x3, Search, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Grid3x3, label: "Categories", path: "/categories" },
  { icon: Search, label: "Search", path: "/search" },
  { icon: Heart, label: "Favorites", path: "/favorites" },
  { icon: User, label: "Profile", path: "/profile" },
];

export function BottomTabs() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {tabs.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors min-h-[44px] min-w-[44px] ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-label={label}
            >
              <Icon
                className="h-6 w-6 mb-0.5"
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={isActive ? 0 : 2}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
