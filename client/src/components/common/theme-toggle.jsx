import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "../../contexts/theme-context";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative hover:bg-accent transition-colors duration-200"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;
