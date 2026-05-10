const DEFAULT_API_BASE_URL = "http://localhost:8000";

const HISTORY_HOST = "www.swmaestro.ai";
const HISTORY_PATH = "/sw/mypage/userAnswer/history.do";
const HISTORY_MENU_NO = "200047";

export const API_BASE_URL = DEFAULT_API_BASE_URL;

export const ALLOWED_URL_PATTERNS = [
  `https://${HISTORY_HOST}${HISTORY_PATH}?menuNo=${HISTORY_MENU_NO}`
];

export const API_ENDPOINTS = {
  recommendations: `${API_BASE_URL}/v1/recommendations`
};

export function isAllowedPageUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname === HISTORY_HOST &&
      parsedUrl.pathname === HISTORY_PATH &&
      parsedUrl.searchParams.get("menuNo") === HISTORY_MENU_NO
    );
  } catch {
    return false;
  }
}
