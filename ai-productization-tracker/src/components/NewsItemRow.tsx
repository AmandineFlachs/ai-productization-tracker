import type { NewsItem } from '../types';
import { CategoryBadge } from './CategoryBadge';
import { TypeTag } from './TypeTag';
import { IconArrowUR, IconChevron } from './icons';

export function NewsItemRow({
  item,
  index,
  total,
  expanded,
  onToggle,
}: {
  item: NewsItem;
  index: number;
  total: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="group relative border-b border-rule dark:border-rule-d hover:bg-paper-2/50 dark:hover:bg-night-2/40 transition-colors">
      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-signal opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="mx-auto max-w-[1240px] px-6 sm:px-10 py-10 sm:py-12 grid grid-cols-12 gap-x-8 gap-y-5">
        <div className="col-span-12 sm:col-span-2 flex sm:flex-col items-baseline sm:items-start gap-3 sm:gap-1.5">
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-2 dark:text-bone-2 num">
            №&thinsp;{String(total - index).padStart(3, '0')}
          </div>
          <time className="font-display font-medium text-[24px] sm:text-[28px] leading-none text-ink dark:text-bone num tracking-[-0.02em]">
            {formatDay(item.date)}
          </time>
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-2 dark:text-bone-2">
            {formatMonthYear(item.date)}
          </div>
        </div>

        <div className="col-span-12 sm:col-span-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
            <span className="flex items-center gap-2">
              <LabAvatar lab={item.lab} />
              <span className="font-display font-medium text-[13.5px] text-ink dark:text-bone">
                {item.lab}
              </span>
            </span>
            <span className="text-ink-4 dark:text-bone-4">·</span>
            <TypeTag type={item.type} />
            <CategoryBadge category={item.category} />
          </div>

          <h3 className="font-display font-semibold text-[20px] sm:text-[23px] leading-[1.2] tracking-[-0.015em] text-ink dark:text-bone text-balance">
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-signal dark:hover:text-signal transition-colors"
            >
              {item.title}
              <IconArrowUR
                size={13}
                className="inline-block ml-1.5 -mt-0.5 text-ink-3 dark:text-bone-3 group-hover:text-signal transition-colors"
              />
            </a>
          </h3>

          {expanded ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-6">
              <div className="md:col-span-7">
                <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ink-3 dark:text-bone-3 mb-2.5">
                  Summary
                </div>
                <p className="text-[14.5px] leading-[1.7] text-ink-2 dark:text-bone-2 text-pretty">
                  {item.summary}
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="relative pl-4 border-l border-signal/70">
                  <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-signal mb-2.5">
                    Why it matters
                  </div>
                  <p className="text-[14px] leading-[1.7] text-ink-2 dark:text-bone-2 text-pretty">
                    {item.why_it_matters}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-[13.5px] leading-[1.65] text-ink-3 dark:text-bone-3 line-clamp-1 text-pretty">
              {item.summary}
            </p>
          )}

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={onToggle}
              className="flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-3 hover:text-ink dark:text-bone-3 dark:hover:text-bone transition-colors"
            >
              <IconChevron
                size={11}
                className={expanded ? 'rotate-180 transition-transform' : 'transition-transform'}
              />
              {expanded ? 'Hide details' : 'Show details'}
            </button>
            <span className="h-3 w-px bg-rule dark:bg-rule-d" />
            <a
              href={item.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.14em] uppercase text-ink-3 hover:text-signal dark:text-bone-3 transition-colors"
            >
              Read article <IconArrowUR size={11} />
            </a>
          </div>
        </div>

        <div className="hidden sm:flex sm:col-span-2 flex-col items-end gap-2 text-right">
          <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-2 dark:text-bone-2 num">
            {relativeTime(item.date)}
          </div>
          <CategoryBadge category={item.category} variant="dot" />
        </div>
      </div>
    </li>
  );
}

function LabAvatar({ lab }: { lab: string }) {
  const hue = Math.abs([...lab].reduce((a, c) => a + c.charCodeAt(0) * 13, 0)) % 360;
  const initials = lab
    .replace(/\bAI\b/i, '')
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-[3px] font-mono font-semibold text-[9.5px]"
      style={{
        background: `oklch(94% 0.02 ${hue})`,
        color: `oklch(34% 0.10 ${hue})`,
      }}
    >
      {initials}
    </span>
  );
}

function formatDay(s: string): string {
  const d = new Date(s + 'T00:00:00');
  return String(d.getDate()).padStart(2, '0');
}
function formatMonthYear(s: string): string {
  const d = new Date(s + 'T00:00:00');
  return d.toLocaleDateString('en', { month: 'short', year: '2-digit' }).replace(',', '').toUpperCase();
}
function relativeTime(s: string): string {
  const d = new Date(s + 'T00:00:00').getTime();
  const now = Date.now();
  const days = Math.round((now - d) / 86_400_000);
  if (days < 1) return 'Today';
  if (days < 7) return days + 'd ago';
  if (days < 30) return Math.round(days / 7) + 'w ago';
  if (days < 365) return Math.round(days / 30) + 'mo ago';
  return Math.round(days / 365) + 'y ago';
}
