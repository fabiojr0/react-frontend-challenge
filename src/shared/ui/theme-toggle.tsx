import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/features/theme/store";
import { Button } from "./button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
