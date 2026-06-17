export interface Tag {
  _id: string;
  name: string;
  userId: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface GetTagsResponse {
  tags: Tag[];
}
