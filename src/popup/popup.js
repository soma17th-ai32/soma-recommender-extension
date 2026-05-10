import { requestRecommendations } from "../api/recommendations.js";
import { isAllowedPageUrl } from "../config.js";

const pageTitle = document.querySelector("#page-title");
const recommendButton = document.querySelector("#recommend-button");
const result = document.querySelector("#result");
const COURSE_HISTORY_LOAD_FAILED_MESSAGE =
  "\uc218\uac15 \uc774\ub825\uc744 \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4.";
const USE_TEST_HISTORIES = true;
const TEST_HISTORIES = [
  createTestHistory({
    id: "11349",
    type: "free-mentoring",
    title: "Team Chilsami - mentor introduction and mentoring direction",
    mentor: "Jang Jinyoung",
    lectureDate: "2026-05-09 11:00:00 ~ 12:00:00",
    registeredAt: "2026-05-06 22:22",
    status: "accepted",
    approval: "OK"
  }),
  createTestHistory({
    id: "11278",
    type: "mentor-lecture",
    title: "2026 ASM Mobile Class - KickOff and OT",
    mentor: "Kim Jongchan",
    lectureDate: "2026-05-07 19:00:00 ~ 21:00:00",
    registeredAt: "2026-05-05 19:29",
    status: "accepted",
    approval: "OK"
  }),
  createTestHistory({
    id: "11131",
    type: "free-mentoring",
    title: "Chilsami team free mentoring",
    mentor: "Kang Daegyu",
    lectureDate: "2026-05-02 16:00:00 ~ 18:00:00",
    registeredAt: "2026-05-02 15:15",
    status: "accepted",
    approval: "OK"
  }),
  createTestHistory({
    id: "11099",
    type: "free-mentoring",
    title: "Project ideation and planning feedback",
    mentor: "Kim Gwanyoung",
    lectureDate: "2026-05-09 17:00:00 ~ 20:00:00",
    registeredAt: "2026-05-01 22:27",
    status: "accepted",
    approval: "OK"
  }),
  createTestHistory({
    id: "11082",
    type: "free-mentoring",
    title: "Chilsami team mentoring",
    mentor: "Park Jungdoo",
    lectureDate: "2026-05-02 19:00:00 ~ 20:00:00",
    registeredAt: "2026-05-01 20:23",
    status: "accepted",
    approval: "OK"
  }),
  createTestHistory({
    id: "11033",
    type: "free-mentoring",
    title: "Server Driven UI introduction: concept and application",
    mentor: "Kang Daegyu",
    lectureDate: "2026-05-02 10:00:00 ~ 12:00:00",
    registeredAt: "2026-05-01 11:37",
    status: "accepted",
    approval: "OK"
  }),
  createTestHistory({
    id: "10997",
    type: "free-mentoring",
    title: "Idea and mentoring direction discussion for Park Sunghyun mentee team",
    mentor: "Kim Hanbit",
    lectureDate: "2026-05-03 14:00:00 ~ 16:00:00",
    registeredAt: "2026-04-30 14:13",
    status: "accepted",
    approval: "-"
  }),
  createTestHistory({
    id: "10940",
    type: "free-mentoring",
    title: "Free mentoring, ideation, and coffee chat for team matching",
    mentor: "Jeon Gabin",
    lectureDate: "2026-05-02 23:00:00 ~ 24:00:00",
    registeredAt: "2026-04-29 14:43",
    status: "accepted",
    approval: "OK"
  }),
  createTestHistory({
    id: "10751",
    type: "free-mentoring",
    title: "Team project planning feedback",
    mentor: "Kim Gwanyoung",
    lectureDate: "2026-04-30 19:00:00 ~ 20:00:00",
    registeredAt: "2026-04-26 15:25",
    status: "accepted",
    approval: "OK"
  }),
  createTestHistory({
    id: "10684",
    type: "free-mentoring",
    title: "Chilsami mentoring",
    mentor: "Kim Doyoung",
    lectureDate: "2026-05-01 13:00:00 ~ 14:00:00",
    registeredAt: "2026-04-25 09:55",
    status: "accepted",
    approval: "OK"
  })
];

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
    pageTitle.textContent = "Cannot find the active tab.";
    recommendButton.disabled = true;
    return;
  }

  const response = await getPageContextFromContentScript(tab.id);
  const url = response?.url || tab.url;
  const allowed = response?.allowed ?? isAllowedPageUrl(url);
  const shouldUseTestHistories =
    allowed &&
    USE_TEST_HISTORIES &&
    (!response?.courseHistories?.length || response.usingTestHistories);

  currentPageContext = {
    allowed,
    title: response?.title || tab.title || "Untitled page",
    body: response?.body,
    url,
    courseHistories: shouldUseTestHistories ? TEST_HISTORIES : response?.courseHistories || [],
    scrapeError: response?.scrapeError,
    usingTestHistories: shouldUseTestHistories || response?.usingTestHistories || false
  };

  pageTitle.textContent = currentPageContext.title;

  if (!allowed) {
    recommendButton.disabled = true;
    renderMessage(
      "Unsupported page",
      "Open the SW Maestro application history page before requesting recommendations."
    );
    return;
  }

  if (currentPageContext.scrapeError && !currentPageContext.usingTestHistories) {
    renderMessage(COURSE_HISTORY_LOAD_FAILED_MESSAGE, "");
    return;
  }

  if (currentPageContext.usingTestHistories) {
    renderMessage(
      "Test history ready",
      `Using ${currentPageContext.courseHistories.length} test history records.`
    );
    return;
  }

  renderMessage("History ready", `Found ${currentPageContext.courseHistories.length} records.`);
}

recommendButton.addEventListener("click", async () => {
  recommendButton.disabled = true;
  recommendButton.textContent = "Requesting...";
  result.hidden = false;

  try {
    const histories = createHistoriesFromPageContext(currentPageContext);
    const recommendation = await requestRecommendations({
      histories,
      limit: 10
    });

    renderRecommendationResult(recommendation);
  } catch (error) {
    renderError(error);
  } finally {
    recommendButton.disabled = false;
    recommendButton.textContent = "Get recommendations";
  }
});

loadPageContext().catch(() => {
  pageTitle.textContent = "Could not load the current page.";
  recommendButton.disabled = true;
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

function createHistoriesFromPageContext(pageContext) {
  if (!pageContext?.url) {
    throw new Error("Page URL is required for recommendation requests.");
  }

  if (!pageContext.allowed) {
    throw new Error("Recommendations can only be requested from the configured URL.");
  }

  if (pageContext.courseHistories?.length > 0) {
    return pageContext.courseHistories;
  }

  throw new Error(COURSE_HISTORY_LOAD_FAILED_MESSAGE);
}

function createTestHistory(history) {
  const url = `https://www.swmaestro.ai/sw/mypage/mentoLec/view.do?qustnrSn=${history.id}&menuNo=200046&history=y`;

  return {
    url,
    title: `[${history.type}] ${history.title}`,
    body: createHistoryBody(history),
    mentor: history.mentor,
    taken_at: parseDateTime(history.registeredAt) || new Date().toISOString()
  };
}

function createHistoryBody(history) {
  return [
    ["type", history.type],
    ["title", history.title],
    ["author", history.mentor],
    ["lecture_date", history.lectureDate],
    ["registered_at", history.registeredAt],
    ["status", history.status],
    ["approval", history.approval]
  ]
    .filter(([, value]) => value && value !== "-")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function parseDateTime(value = "") {
  const match = String(value).match(
    /(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})(?:\s+(?<hour>\d{1,2}):(?<minute>\d{1,2}))?/
  );

  if (!match?.groups) {
    return null;
  }

  const { year, month, day, hour = "0", minute = "0" } = match.groups;
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function renderMessage(title, message) {
  result.hidden = false;
  result.innerHTML = `
    <p class="result-title">${escapeHtml(title)}</p>
    ${message ? `<p class="result-meta">${escapeHtml(message)}</p>` : ""}
  `;
}

function renderRecommendationResult(recommendation) {
  const items = recommendation.items || [];

  if (items.length === 0) {
    result.innerHTML = `
      <p class="result-title">No recommendations found.</p>
      <p class="result-meta">${escapeHtml(recommendation.interest_summary || "No interest summary returned.")}</p>
    `;
    return;
  }

  result.innerHTML = `
    <p class="result-title">${items.length} recommendations</p>
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
    <p class="result-title">Recommendation request failed.</p>
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
