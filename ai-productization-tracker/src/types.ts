export type Category = 'research' | 'productizing' | 'mature_product';

export type NewsType =
  | 'model_release'
  | 'paper'
  | 'benchmark'
  | 'tooling'
  | 'product_launch'
  | 'safety';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  lab: string;
  category: Category;
  type: NewsType;
  summary: string;
  why_it_matters: string;
  source_url: string;
}

export interface NewsData {
  _meta?: {
    source: string;
    generated_at: string;
    knowledge_cutoff: string;
    note?: string;
  };
  items: NewsItem[];
}
