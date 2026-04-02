import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Film, Heart, LayoutDashboard, LogOut } from "lucide-react";
import { Toaster } from "sonner";
import { useAuth } from "@/features/auth/hooks";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Film className="h-6 w-6" />
              CineDash
            </NavLink>
            <nav className="hidden items-center gap-1 sm:flex">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )
                }
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </NavLink>
              <NavLink
                to="/watchlist"
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )
                }
              >
                <Heart className="h-4 w-4" />
                Minha Lista
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sair">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background sm:hidden">
        <div className="flex h-14 items-center justify-around">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 text-xs",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 text-xs",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            <Heart className="h-5 w-5" />
            Minha Lista
          </NavLink>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 pb-20 sm:pb-6">
        <Outlet />
      </main>

      <Toaster richColors position="top-right" />
    </div>
  );
}
