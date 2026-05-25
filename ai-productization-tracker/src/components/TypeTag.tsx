import type { NewsType } from '../types';

export const TYPE_LABELS: Record<NewsType, string> = {
  model_release: 'Model release',
  paper: 'Paper',
  benchmark: 'Benchmark',
  tooling: 'Tooling',
  product_launch: 'Product launch',
  safety: 'Safety',
};

const TYPE_SHORT: Record<NewsType, string> = {
  model_release: 'MODEL',
  paper: 'PAPER',
  benchmark: 'BENCH',
  tooling: 'TOOL',
  product_launch: 'LAUNCH',
  safety: 'SAFETY',
};

export function TypeTag({ type, mode = 'short' }: { type: NewsType; mode?: 'short' | 'long' }) {
  const label = mode === 'short' ? TYPE_SHORT[type] : TYPE_LABELS[type];
  return (
    <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink-3 dark:text-bone-3 border border-rule dark:border-rule-d rounded-sm px-1.5 py-[2px]">
      {label}
    </span>
  );
}
