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
    type: "\uc790\uc720\uba58\ud1a0\ub9c1",
    title: "\ud300 \uce60\uc0bc\uc774 - \uba58\ud1a0\uc18c\uac1c, \uba58\ud1a0\ub9c1\ubc29\ud5a5",
    mentor: "\uc7a5\uc9c4\uc601(6236)",
    lectureDate: "2026-05-09(\ud1a0) 11:00:00 ~ 12:00:00",
    registeredAt: "2026-05-06 22:22",
    status: "\uc811\uc218\uc644\ub8cc",
    approval: "OK"
  }),
  createTestHistory({
    id: "11278",
    type: "\uba58\ud1a0\ud2b9\uac15",
    title: "[Mobile Class] 2026 ASM Mobile Class - KickOff/OT",
    mentor: "\uae40\uc885\ucc2c",
    lectureDate: "2026-05-07(\ubaa9) 19:00:00 ~ 21:00:00",
    registeredAt: "2026-05-05 19:29",
    status: "\uc811\uc218\uc644\ub8cc",
    approval: "OK"
  }),
  createTestHistory({
    id: "11131",
    type: "\uc790\uc720\uba58\ud1a0\ub9c1",
    title: "\uce60\uc0bc\uc774\ud300 \uc790\uc720\uba58\ud1a0\ub9c1",
    mentor: "\uac15\ub300\uaddc",
    lectureDate: "2026-05-02(\ud1a0) 16:00:00 ~ 18:00:00",
    registeredAt: "2026-05-02 15:15",
    status: "\uc811\uc218\uc644\ub8cc",
    approval: "OK"
  }),
  createTestHistory({
    id: "11099",
    type: "\uc790\uc720\uba58\ud1a0\ub9c1",
    title:
      "\ud504\ub85c\uc81d\ud2b8 \uc544\uc774\ub514\uc5d0\uc774\uc158 \ubc0f \uae30\ud68d \ud53c\ub4dc\ubc31",
    mentor: "\uae40\uad00\uc601",
    lectureDate: "2026-05-09(\ud1a0) 17:00:00 ~ 20:00:00",
    registeredAt: "2026-05-01 22:27",
    status: "\uc811\uc218\uc644\ub8cc",
    approval: "OK"
  }),
  createTestHistory({
    id: "11082",
    type: "\uc790\uc720\uba58\ud1a0\ub9c1",
    title: "\uce60\uc0bc\uc774 \ud300 \uba58\ud1a0\ub9c1",
    mentor: "\ubc15\uc815\ub450",
    lectureDate: "2026-05-02(\ud1a0) 19:00:00 ~ 20:00:00",
    registeredAt: "2026-05-01 20:23",
    status: "\uc811\uc218\uc644\ub8cc",
    approval: "OK"
  }),
  createTestHistory({
    id: "11033",
    type: "\uc790\uc720\uba58\ud1a0\ub9c1",
    title: "SDUI(Server Driven UI) \uc785\ubb38 : \ucee8\uc149\uacfc \ud65c\uc6a9",
    mentor: "\uac15\ub300\uaddc",
    lectureDate: "2026-05-02(\ud1a0) 10:00:00 ~ 12:00:00",
    registeredAt: "2026-05-01 11:37",
    status: "\uc811\uc218\uc644\ub8cc",
    approval: "OK"
  }),
  createTestHistory({
    id: "10997",
    type: "\uc790\uc720\uba58\ud1a0\ub9c1",
    title:
      "\ubc15\uc131\ud604 \uba58\ud2f0\ud300 \uc544\uc774\ub514\uc5b4 \ubc0f \uba58\ud1a0\ub9c1 \ubc29\ud5a5\uc131 \ub17c\uc758",
    mentor: "\uae40\ud55c\ube5b",
    lectureDate: "2026-05-03(\uc77c) 14:00:00 ~ 16:00:00",
    registeredAt: "2026-04-30 14:13",
    status: "\uc811\uc218\uc644\ub8cc",
    approval: "-"
  }),
  createTestHistory({
    id: "10940",
    type: "\uc790\uc720\uba58\ud1a0\ub9c1",
    title:
      "\ud300\ub9e4\uce6d\uc744 \uc704\ud55c \uc790\uc720\uba58\ud1a0\ub9c1 + \uc544\uc774\ub370\uc774\uc158 + \ucee4\ud53c\ucc57 feat(\uce60\uc0bc\uc774)",
    mentor: "\uc804\uac00\ube48",
    lectureDate: "2026-05-02(\ud1a0) 23:00:00 ~ 24:00:00",
    registeredAt: "2026-04-29 14:43",
    status: "\uc811\uc218\uc644\ub8cc",
    approval: "OK"
  }),
  createTestHistory({
    id: "10751",
    type: "\uc790\uc720\uba58\ud1a0\ub9c1",
    title: "\ud300\ub2e8\uc704 \ud504\ub85c\uc81d\ud2b8 \uae30\ud68d \ud53c\ub4dc\ubc31",
    mentor: "\uae40\uad00\uc601",
    lectureDate: "2026-04-30(\ubaa9) 19:00:00 ~ 20:00:00",
    registeredAt: "2026-04-26 15:25",
    status: "\uc811\uc218\uc644\ub8cc",
    approval: "OK"
  }),
  createTestHistory({
    id: "10684",
    type: "\uc790\uc720\uba58\ud1a0\ub9c1",
    title: "\uce60\uc0bc\uc774 \uba58\ud1a0\ub9c1",
    mentor: "\uae40\ub3c4\uc601",
    lectureDate: "2026-05-01(\uae08) 13:00:00 ~ 14:00:00",
    registeredAt: "2026-04-25 09:55",
    status: "\uc811\uc218\uc644\ub8cc",
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
    pageTitle.textContent =
      "\ud65c\uc131 \ud0ed \uc815\ubcf4\ub97c \ucc3e\uc744 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.";
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
    title: response?.title || tab.title || "\uc81c\ubaa9 \uc5c6\ub294 \ud398\uc774\uc9c0",
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
      "\uc9c0\uc6d0\ud558\uc9c0 \uc54a\ub294 \ud398\uc774\uc9c0\uc785\ub2c8\ub2e4.",
      "SW \ub9c8\uc5d0\uc2a4\ud2b8\ub85c \uc811\uc218\ub0b4\uc5ed \ud398\uc774\uc9c0\uc5d0\uc11c\ub9cc \ucd94\ucc9c\uc744 \uc694\uccad\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."
    );
    return;
  }

  if (currentPageContext.scrapeError && !currentPageContext.usingTestHistories) {
    renderMessage(COURSE_HISTORY_LOAD_FAILED_MESSAGE, "");
    return;
  }

  if (currentPageContext.usingTestHistories) {
    renderMessage(
      "\ud14c\uc2a4\ud2b8 \uc218\uac15 \uc774\ub825 \uc900\ube44 \uc644\ub8cc",
      `\ud14c\uc2a4\ud2b8 \uc218\uac15 \uc774\ub825 ${currentPageContext.courseHistories.length}\uac1c\ub97c \uc0ac\uc6a9\ud569\ub2c8\ub2e4.`
    );
    return;
  }

  renderMessage(
    "\uc218\uac15 \uc774\ub825 \uc900\ube44 \uc644\ub8cc",
    `${currentPageContext.courseHistories.length}\uac1c\uc758 \uc218\uac15 \uc774\ub825\uc744 \ucc3e\uc558\uc2b5\ub2c8\ub2e4.`
  );
}

recommendButton.addEventListener("click", async () => {
  recommendButton.disabled = true;
  recommendButton.textContent = "\ucd94\ucc9c \uc694\uccad \uc911...";
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
    recommendButton.textContent = "\ucd94\ucc9c \ubc1b\uae30";
  }
});

loadPageContext().catch(() => {
  pageTitle.textContent =
    "\ud604\uc7ac \ud398\uc774\uc9c0 \uc815\ubcf4\ub97c \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4.";
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
    throw new Error(
      "\ucd94\ucc9c \uc694\uccad\uc5d0 \uc0ac\uc6a9\ud560 \ud398\uc774\uc9c0 URL\uc774 \uc5c6\uc2b5\ub2c8\ub2e4."
    );
  }

  if (!pageContext.allowed) {
    throw new Error(
      "\uc124\uc815\ub41c URL\uc5d0\uc11c\ub9cc \ucd94\ucc9c\uc744 \uc694\uccad\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4."
    );
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
    ["\uad6c\ubd84", history.type],
    ["\uc81c\ubaa9", history.title],
    ["\uc791\uc131\uc790", history.mentor],
    ["\uac15\uc758\ub0a0\uc9dc", history.lectureDate],
    ["\uc811\uc218\uc77c", history.registeredAt],
    ["\uc811\uc218\uc0c1\ud0dc", history.status],
    ["\uac1c\uc124\uc2b9\uc778", history.approval]
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
      <p class="result-title">\ucd94\ucc9c \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.</p>
      <p class="result-meta">${escapeHtml(recommendation.interest_summary || "\uad00\uc2ec\uc0ac \uc694\uc57d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4.")}</p>
    `;
    return;
  }

  result.innerHTML = `
    <p class="result-title">\ucd94\ucc9c \uacb0\uacfc ${items.length}\uac1c</p>
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
    <p class="result-title">\ucd94\ucc9c \uc694\uccad\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4.</p>
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
