"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Hydration mismatch-in qarşısını almaq üçün
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className='p-2 h-10 w-10' />;

  return (
    <Button
      variant='ghost'
      size='icon'
      className='rounded-full text-gray-500 hover:text-orange-500 transition-colors'
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
