import type { Content } from "./content.types";

export interface ShareBrainRequest {
  share: boolean;
}

export interface ShareBrainResponse {
  hash?: string;
  message?: string;
}

export interface SharedBrainResponse {
  username: string;
  content: Content[];
}
