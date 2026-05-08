import { requestRecommendations } from "../api/recommendations.js";

const pageTitle = document.querySelector("#page-title");
const recommendButton = document.querySelector("#recommend-button");
const result = document.querySelector("#result");

let currentPageContext = null;

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  return tab;
}

async function loadPageContext() {
  const tab = await getActiveTab();

  if (!tab?.id) {
    pageTitle.textContent = "활성 탭 정보를 찾을 수 없습니다.";
    return;
  }

  const response = await getPageContextFromContentScript(tab.id);

  currentPageContext = {
    title: response?.title || tab.title || "제목 없는 페이지",
    body: response?.body,
    url: response?.url || tab.url
  };

  pageTitle.textContent = currentPageContext.title;
}

recommendButton.addEventListener("click", async () => {
  recommendButton.disabled = true;
  recommendButton.textContent = "추천 요청 중...";
  result.hidden = false;

  try {
    const history = createHistoryFromPageContext(currentPageContext);
    const recommendation = await requestRecommendations({
      histories: [history],
      limit: 10
    });

    renderRecommendationResult(recommendation);
  } catch (error) {
    renderError(error);
  } finally {
    recommendButton.disabled = false;
    recommendButton.textContent = "추천 받기";
  }
});

loadPageContext().catch(() => {
  pageTitle.textContent = "현재 페이지 정보를 불러오지 못했습니다.";
});

async function getPageContextFromContentScript(tabId) {
  try {
    return await chrome.tabs.sendMessage(tabId, {
      type: "GET_PAGE_CONTEXT"
    });
  } catch {
    return null;
  }
}

function createHistoryFromPageContext(pageContext) {
  if (!pageContext?.url) {
    throw new Error("추천 요청에 사용할 페이지 URL이 없습니다.");
  }

  return {
    title: pageContext.title,
    body: pageContext.body,
    url: pageContext.url,
    taken_at: new Date().toISOString()
  };
}

function renderRecommendationResult(recommendation) {
  const items = recommendation.items || [];

  if (items.length === 0) {
    result.innerHTML = `
      <p class="result-title">추천 결과가 없습니다.</p>
      <p class="result-meta">${escapeHtml(recommendation.interest_summary || "관심사 요약이 없습니다.")}</p>
    `;
    return;
  }

  result.innerHTML = `
    <p class="result-title">추천 결과 ${items.length}개</p>
    <p class="result-meta">${escapeHtml(recommendation.interest_summary)}</p>
    <ul class="recommendation-list">
      ${items.map(renderRecommendationItem).join("")}
    </ul>
  `;
}

function renderRecommendationItem(item) {
  return `
    <li class="recommendation-item">
      <a href="${escapeAttribute(item.url)}" target="_blank" rel="noreferrer">
        ${escapeHtml(item.title)}
      </a>
      <p>${escapeHtml(item.summary)}</p>
      <p class="reason">${escapeHtml(item.reason)}</p>
    </li>
  `;
}

function renderError(error) {
  result.innerHTML = `
    <p class="result-title">추천 요청에 실패했습니다.</p>
    <p class="result-meta">${escapeHtml(error.message)}</p>
    ${error.code ? `<p class="result-code">${escapeHtml(error.code)}</p>` : ""}
  `;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value);
}
