import type { NewsItem } from '../types';
import { IconMoon, IconSun } from './icons';

export function Hero({
  items,
  dark,
  onToggleDark,
}: {
  items: NewsItem[];
  dark: boolean;
  onToggleDark: () => void;
}) {
  return (
    <header className="relative border-b border-rule dark:border-rule-d overflow-hidden">
      <div className="absolute inset-0 grid-rule text-ink dark:text-bone pointer-events-none" />

      <div className="relative border-b border-rule dark:border-rule-d">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-10 h-10 flex items-center justify-end font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3 dark:text-bone-3">
          <button
            onClick={onToggleDark}
            className="flex items-center gap-1.5 hover:text-ink dark:hover:text-bone transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <IconSun size={13} /> : <IconMoon size={13} />}
            <span>{dark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-6 sm:px-10 pt-16 sm:pt-20 pb-14 sm:pb-16">
        <h1 className="anim-hero-title font-display font-bold text-[clamp(36px,5.2vw,64px)] leading-[0.98] tracking-[-0.025em] text-ink dark:text-bone">
          AI Productization Tracker
        </h1>
        <p className="anim-hero-sub mt-6 max-w-[64ch] text-[15.5px] leading-[1.7] text-ink-2 dark:text-bone-2 text-pretty">
          Research and product news from AI labs, by date. {items.length} items tracked.
        </p>
      </div>
    </header>
  );
}
