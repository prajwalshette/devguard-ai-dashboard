import { Github, Zap, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { DevGuardLogo } from "./DevGuardLogo";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface TopNavigationProps {
  isConnected: boolean;
  plan: "free" | "pro";
}

export function TopNavigation({ isConnected, plan }: TopNavigationProps) {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/">
            <DevGuardLogo />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                location.pathname === "/" 
                  ? "text-foreground bg-muted" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                location.pathname === "/settings" 
                  ? "text-foreground bg-muted" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-muted-foreground" />
            <Badge variant={isConnected ? "connected" : "disconnected"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          <Badge variant={plan === "pro" ? "pro" : "free"} className="uppercase tracking-wide">
            {plan}
          </Badge>

          {plan === "free" && (
            <Button variant="upgrade" size="sm">
              <Zap className="h-3.5 w-3.5" />
              Upgrade to Pro
            </Button>
          )}

          <Link to="/settings" className="md:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
