import { useThemeStore } from "../../store/themeStore";

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] cursor-pointer text-sm"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}