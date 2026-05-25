import { useEffect, useMemo, useState } from 'react';
import newsData from '../../data/curated/news.json';
import type { NewsData, Category, NewsType } from './types';
import { Hero } from './components/Hero';
import { Filters, type Option } from './components/Filters';
import { NewsItemRow } from './components/NewsItemRow';
import { Footer } from './components/Footer';

const data = newsData as NewsData;

const CATEGORY_OPTIONS: Option[] = [
  { value: 'all', label: 'All categories' },
  { value: 'research', label: 'Research', dot: 'research' },
  { value: 'productizing', label: 'Productizing', dot: 'productizing' },
  { value: 'mature_product', label: 'Mature product', dot: 'mature' },
];

const TYPE_OPTIONS: Option[] = [
  { value: 'all', label: 'All types' },
  { value: 'model_release', label: 'Model release' },
  { value: 'paper', label: 'Paper' },
  { value: 'benchmark', label: 'Benchmark' },
  { value: 'tooling', label: 'Tooling' },
  { value: 'product_launch', label: 'Product launch' },
  { value: 'safety', label: 'Safety' },
];

export default function App() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('apt:dark') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('apt:dark', dark ? '1' : '0');
    } catch {}
  }, [dark]);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [type, setType] = useState<NewsType | 'all'>('all');
  const [lab, setLab] = useState<string>('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');

  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(true);

  const labOptions = useMemo<Option[]>(() => {
    const labs = Array.from(new Set(data.items.map((i) => i.lab))).sort();
    return [{ value: 'all', label: 'All labs' }, ...labs.map((l) => ({ value: l, label: l }))];
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.items
      .filter(
        (i) =>
          (category === 'all' || i.category === category) &&
          (type === 'all' || i.type === type) &&
          (lab === 'all' || i.lab === lab) &&
          (q === '' ||
            i.title.toLowerCase().includes(q) ||
            i.summary.toLowerCase().includes(q) ||
            i.why_it_matters.toLowerCase().includes(q) ||
            i.lab.toLowerCase().includes(q)),
      )
      .slice()
      .sort((a, b) => (sort === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [category, type, lab, sort, query]);

  const isExpanded = (id: string) => (id in overrides ? overrides[id] : allExpanded);
  const toggleRow = (id: string) =>
    setOverrides((prev) => ({ ...prev, [id]: !isExpanded(id) }));
  const onToggleAll = () => {
    setAllExpanded((v) => !v);
    setOverrides({});
  };
  const resetFilters = () => {
    setQuery('');
    setCategory('all');
    setType('all');
    setLab('all');
  };

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-night dark:text-bone antialiased">
      <Hero items={data.items} dark={dark} onToggleDark={() => setDark((v) => !v)} />

      <Filters
        query={query}
        onQuery={setQuery}
        category={category}
        setCategory={(v) => setCategory(v as Category | 'all')}
        categories={CATEGORY_OPTIONS}
        type={type}
        setType={(v) => setType(v as NewsType | 'all')}
        types={TYPE_OPTIONS}
        lab={lab}
        setLab={setLab}
        labs={labOptions}
        sort={sort}
        setSort={setSort}
        allExpanded={allExpanded}
        onToggleAll={onToggleAll}
        resultCount={visible.length}
        totalCount={data.items.length}
      />

      <main>
        {visible.length === 0 ? (
          <EmptyState onReset={resetFilters} />
        ) : (
          <ol>
            {visible.map((item, i) => (
              <NewsItemRow
                key={item.id}
                item={item}
                index={i}
                total={visible.length}
                expanded={isExpanded(item.id)}
                onToggle={() => toggleRow(item.id)}
              />
            ))}
          </ol>
        )}
      </main>

      <Footer items={data.items} />
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto max-w-[1280px] px-6 sm:px-8 py-32 text-center">
      <div className="font-display font-semibold uppercase text-[40px] leading-tight tracking-[-0.025em] text-ink-2 dark:text-bone-2">
        Nothing here.
      </div>
      <p className="mt-3 font-mono text-[12px] tracking-[0.14em] uppercase text-ink-3 dark:text-bone-3">
        No items match the current filter combination.
      </p>
      <button
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-ink text-paper dark:bg-bone dark:text-night font-mono text-[11px] tracking-[0.14em] uppercase"
      >
        Clear filters
      </button>
    </div>
  );
}
