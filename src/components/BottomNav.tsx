import { Home, Grid3x3, Search, Heart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomNav() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Grid3x3, label: "Categories", path: "/categories" },
    { icon: Search, label: "Search", path: "/search" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: User, label: "Profile", path: "/profile" },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t border-border z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon 
                className="h-6 w-6 mb-0.5" 
                fill={active ? "currentColor" : "none"}
                strokeWidth={active ? 0 : 2}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}