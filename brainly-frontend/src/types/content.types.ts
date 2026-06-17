import type { Tag } from "./tags.types";

export type ContentType = "youtube" | "twitter" | "article" | "document" | "link";

export interface Content {
  _id: string;
  title: string;
  link: string;
  type: ContentType;
  content: string;
  tags: Tag[];
  userId: string;
}

export interface CreateContentRequest {
  title: string;
  link: string;
  type: ContentType;
  content?: string;
  tags?: string[];
}

export interface UpdateContentRequest {
  title?: string;
  link?: string;
  type?: ContentType;
  content?: string;
  tags?: string[];
}

export interface ContentFilters {
  type?: ContentType | "";
  tag?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface GetContentResponse {
  content: Content[];
}
