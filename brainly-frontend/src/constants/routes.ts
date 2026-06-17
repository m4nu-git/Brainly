export const ROUTES = {
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  DASHBOARD: "/dashboard",
  TAGS: "/tags",
  SHARED_BRAIN: "/brain/:shareLink",
  NOT_FOUND: "/404",
} as const;

export const API_BASE_URL = "http://localhost:3000/api/v1";
