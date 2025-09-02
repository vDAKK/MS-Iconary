import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { key: 'light', icon: Sun, label: 'Clair' },
    { key: 'dark', icon: Moon, label: 'Sombre' },
    { key: 'system', icon: Monitor, label: 'Système' }
  ] as const;

  return (
    <div className="flex items-center gap-1 p-1 glass rounded-lg border border-border/50">
      {themes.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`
            flex items-center justify-center w-8 h-8 rounded-md
            transition-all duration-smooth
            ${theme === key 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }
          `}
          title={`Mode ${label}`}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};