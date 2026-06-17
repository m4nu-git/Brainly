export type ContentType = 'youtube' | 'twitter' | 'article' | 'document' | 'link';

export interface Tag {
  _id: string;
  name: string;
  userId: string;
}

export interface ContentItem {
  _id: string;
  title: string;
  link: string;
  type: ContentType;
  content: string;
  tags: Tag[];
  userId: string;
}

export interface ContentFilters {
  type?: ContentType;
  tag?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface ShareBrainResponse {
  hash?: string;
  message?: string;
}

export interface SharedBrainResponse {
  username: string;
  content: ContentItem[];
}
