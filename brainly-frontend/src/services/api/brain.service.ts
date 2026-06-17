import { api } from "./axios";
import axios from "axios";
import { API_BASE_URL } from "../../constants/routes";
import type { ShareBrainRequest, ShareBrainResponse, SharedBrainResponse } from "../../types/brain.types";

export const brainService = {
  shareBrain: (data: ShareBrainRequest) =>
    api.post<ShareBrainResponse>("/brain/share", data),

  getSharedBrain: (shareLink: string) =>
    axios.get<SharedBrainResponse>(`${API_BASE_URL}/brain/${shareLink}`),
};
