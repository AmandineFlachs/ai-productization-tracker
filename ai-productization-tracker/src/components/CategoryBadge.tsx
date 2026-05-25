import type { Category } from '../types';

type Variant = 'chip' | 'dot';

const META: Record<Category, { label: string; chip: string; dot: string }> = {
  research: {
    label: 'Research',
    chip: 'bg-cat-research-soft text-cat-research ring-cat-research/20',
    dot: 'bg-cat-research',
  },
  productizing: {
    label: 'Productizing',
    chip: 'bg-cat-productizing-soft text-cat-productizing ring-cat-productizing/20',
    dot: 'bg-cat-productizing',
  },
  mature_product: {
    label: 'Mature product',
    chip: 'bg-cat-mature-soft text-cat-mature ring-cat-mature/20',
    dot: 'bg-cat-mature',
  },
};

export function CategoryBadge({
  category,
  variant = 'chip',
}: {
  category: Category;
  variant?: Variant;
}) {
  const m = META[category];
  if (variant === 'dot') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.12em] text-ink-3 dark:text-bone-3">
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${m.dot}`} />
        {m.label}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-[2px] text-[10.5px] font-medium ring-1 ring-inset ${m.chip}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

export const CATEGORY_META = META;
