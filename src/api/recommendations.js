import { API_ENDPOINTS } from "../config.js";

export async function requestRecommendations({ histories, limit = 10 }) {
  const response = await fetch(API_ENDPOINTS.recommendations, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      histories,
      limit
    })
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw createRecommendationError(payload, response.status);
  }

  return payload;
}

async function parseJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function createRecommendationError(payload, status) {
  const error = new Error(
    payload?.error?.message || `Recommendation request failed. Status code: ${status}`
  );

  error.code = payload?.error?.code || "RECOMMENDATION_REQUEST_FAILED";
  error.status = status;
  error.requestId = payload?.request_id;

  return error;
}
