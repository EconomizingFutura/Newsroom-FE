export const API_LIST = Object.freeze({
  LOGIN: import.meta.env.VITE_BASE_URL,
  REGISTER: import.meta.env.VITE_LOGIN,
  HISTORY: import.meta.env.VITE_HISTORY,
  STATS: import.meta.env.VITE_STATS,
  REVIEW_ARTICLE: import.meta.env.VITE_REVIEW,
  SUBMIT_ARTICLE: import.meta.env.VITE_SUBMIT,
  DRAFT_ARTICLE: import.meta.env.VITE_DRAFT,
  DRAFT_BY_ARTICLE: import.meta.env.VITE_DRAFT_BY_ID,
});
