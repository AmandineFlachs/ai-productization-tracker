import type { NewsItem } from '../types';

export function Footer({ items }: { items: NewsItem[] }) {
  const labCount = new Set(items.map((i) => i.lab)).size;
  const newest = items.slice().sort((a, b) => b.date.localeCompare(a.date))[0]?.date;

  return (
    <footer className="border-t border-rule dark:border-rule-d mt-24">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8 py-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-3 dark:text-bone-3">
        <span>
          {items.length} items · {labCount} labs · 6 types · 3 categories
        </span>
        <span>
          Last updated{' '}
          {newest
            ? new Date(newest + 'T00:00:00').toLocaleDateString('en', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '—'}
        </span>
      </div>
    </footer>
  );
}
