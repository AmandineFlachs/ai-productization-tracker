import { useEffect, useRef, useState } from 'react';
import { IconCheck, IconChevron, IconClose, IconSearch, IconSort } from './icons';

export type Option = { value: string; label: string; dot?: 'research' | 'productizing' | 'mature' };

type Props = {
  query: string;
  onQuery: (q: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categories: Option[];
  type: string;
  setType: (v: string) => void;
  types: Option[];
  lab: string;
  setLab: (v: string) => void;
  labs: Option[];
  sort: 'asc' | 'desc';
  setSort: (v: 'asc' | 'desc') => void;
  allExpanded: boolean;
  onToggleAll: () => void;
  resultCount: number;
  totalCount: number;
};

export function Filters(props: Props) {
  const {
    query,
    onQuery,
    category,
    setCategory,
    categories,
    type,
    setType,
    types,
    lab,
    setLab,
    labs,
    sort,
    setSort,
    allExpanded,
    onToggleAll,
    resultCount,
    totalCount,
  } = props;

  return (
    <div className="sticky top-0 z-30 backdrop-blur bg-paper/85 dark:bg-night/85 border-b border-rule dark:border-rule-d">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8 py-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-[360px]">
          <IconSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 dark:text-bone-3"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search titles, summaries, labs…"
            className="w-full pl-9 pr-9 py-2 rounded-md bg-paper-2 dark:bg-night-2 border border-rule dark:border-rule-d text-[13.5px] font-mono placeholder:text-ink-4 dark:placeholder:text-bone-4 focus:border-ink dark:focus:border-bone focus:ring-0 text-ink dark:text-bone"
          />
          {query && (
            <button
              onClick={() => onQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-ink-3 hover:text-ink dark:text-bone-3 dark:hover:text-bone"
            >
              <IconClose size={12} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip label="Category" value={category} onChange={setCategory} options={categories} />
          <FilterChip label="Type" value={type} onChange={setType} options={types} />
          <FilterChip label="Lab" value={lab} onChange={setLab} options={labs} />
        </div>

        <div className="flex-1" />

        <button
          onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-mono uppercase tracking-[0.1em] text-ink-2 dark:text-bone-2 hover:bg-paper-2 dark:hover:bg-night-2 transition-colors"
          title="Toggle sort order"
        >
          <IconSort size={13} />
          {sort === 'desc' ? 'Newest' : 'Oldest'}
        </button>

        <button
          onClick={onToggleAll}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-mono uppercase tracking-[0.1em] text-ink-2 dark:text-bone-2 hover:bg-paper-2 dark:hover:bg-night-2 transition-colors"
        >
          {allExpanded ? 'Collapse all' : 'Expand all'}
        </button>

        <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-3 dark:text-bone-3 pl-2 border-l border-rule dark:border-rule-d">
          <span className="text-ink dark:text-bone num">{resultCount}</span>
          <span className="opacity-60"> / {totalCount}</span>
        </div>
      </div>
    </div>
  );
}

const DOT_CLASS: Record<NonNullable<Option['dot']>, string> = {
  research: 'bg-cat-research',
  productizing: 'bg-cat-productizing',
  mature: 'bg-cat-mature',
};

function FilterChip({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const active = value !== 'all';
  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-mono uppercase tracking-[0.1em] transition-colors ${
          active
            ? 'bg-ink text-paper dark:bg-bone dark:text-night'
            : 'bg-paper-2 dark:bg-night-2 text-ink-2 dark:text-bone-2 hover:bg-paper-3 dark:hover:bg-night-3'
        }`}
      >
        <span className="opacity-60">{label}</span>
        <span>{active ? current?.label : 'All'}</span>
        <IconChevron size={11} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
        {active && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange('all');
            }}
            className="ml-1 -mr-1 p-0.5 hover:opacity-70 rounded"
            role="button"
            aria-label="Clear"
          >
            <IconClose size={10} />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 min-w-[220px] max-h-[360px] overflow-auto bg-paper dark:bg-night-2 border border-rule dark:border-rule-d rounded-md shadow-xl shadow-black/5 dark:shadow-black/40 z-40 py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left flex items-center justify-between px-3 py-1.5 text-[13px] hover:bg-paper-2 dark:hover:bg-night-3 ${
                opt.value === value ? 'text-ink dark:text-bone' : 'text-ink-2 dark:text-bone-2'
              }`}
            >
              <span className="flex items-center gap-2">
                {opt.dot && (
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${DOT_CLASS[opt.dot]}`} />
                )}
                {opt.label}
              </span>
              {opt.value === value && <IconCheck size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
