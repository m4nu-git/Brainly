import { ContentType } from '@/types';

export interface ContentTypeConfig {
  label: string;
  color: string;
  lightColor: string;
}

export const CONTENT_TYPES: Record<ContentType, ContentTypeConfig> = {
  youtube: { label: 'YouTube', color: '#EF4444', lightColor: '#FEE2E2' },
  twitter: { label: 'Twitter', color: '#3B82F6', lightColor: '#DBEAFE' },
  article: { label: 'Article', color: '#22C55E', lightColor: '#DCFCE7' },
  document: { label: 'Document', color: '#F59E0B', lightColor: '#FEF3C7' },
  link: { label: 'Link', color: '#8B5CF6', lightColor: '#EDE9FE' },
};

export const CONTENT_TYPE_LIST: ContentType[] = [
  'youtube',
  'twitter',
  'article',
  'document',
  'link',
];

export const ALL_FILTER = 'all' as const;
export type FilterType = ContentType | typeof ALL_FILTER;
