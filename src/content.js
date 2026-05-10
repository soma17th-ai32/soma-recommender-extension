const HISTORY_HOST = "www.swmaestro.ai";
const HISTORY_PATH = "/sw/mypage/userAnswer/history.do";
const HISTORY_MENU_NO = "200047";
const MAX_HISTORY_PAGES = 20;
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
    title: "2026 ASM Mobile Class - KickOff and OT",
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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "GET_PAGE_CONTEXT") {
    return;
  }

  buildPageContext()
    .then(sendResponse)
    .catch((error) => {
      sendResponse({
        allowed: isAllowedPageUrl(window.location.href),
        title: document.title,
        body: getText(document.body).slice(0, 2000),
        url: window.location.href,
        courseHistories: TEST_HISTORIES,
        scrapeError: error.message,
        usingTestHistories: true
      });
    });

  return true;
});

async function buildPageContext() {
  const url = window.location.href;

  if (!isAllowedPageUrl(url)) {
    return {
      allowed: false,
      title: document.title,
      url,
      courseHistories: []
    };
  }

  if (USE_TEST_HISTORIES) {
    return {
      allowed: true,
      title: document.title,
      body: getText(document.body).slice(0, 2000),
      url,
      courseHistories: TEST_HISTORIES,
      usingTestHistories: true
    };
  }

  const scrapedHistories = await scrapeAllHistoryPages(document, url);
  const courseHistories = scrapedHistories.length > 0 ? scrapedHistories : TEST_HISTORIES;

  return {
    allowed: true,
    title: document.title,
    body: getText(document.body).slice(0, 2000),
    url,
    courseHistories,
    usingTestHistories: scrapedHistories.length === 0
  };
}

async function scrapeAllHistoryPages(currentDocument, currentUrl) {
  const pageUrls = getHistoryPageUrls(currentDocument, currentUrl);
  const histories = [];

  for (const pageUrl of pageUrls) {
    const pageDocument = isSameUrl(pageUrl, currentUrl)
      ? currentDocument
      : await fetchHistoryDocument(pageUrl);
    histories.push(...scrapeHistoryDocument(pageDocument, pageUrl));
  }

  return dedupeHistories(histories);
}

async function fetchHistoryDocument(url) {
  const response = await fetch(url, {
    credentials: "include"
  });

  if (!response.ok) {
    throw new Error(`Failed to load history page. Status code: ${response.status}`);
  }

  const html = await response.text();
  return new DOMParser().parseFromString(html, "text/html");
}

function getHistoryPageUrls(doc, currentUrl) {
  const current = new URL(currentUrl);
  const endPage = getEndPage(doc);
  const urls = [];

  for (let pageIndex = 1; pageIndex <= endPage; pageIndex += 1) {
    const url = new URL(current.href);
    url.searchParams.set("menuNo", HISTORY_MENU_NO);
    url.searchParams.set("pageIndex", String(pageIndex));
    urls.push(url.href);
  }

  return urls.slice(0, MAX_HISTORY_PAGES);
}

function getEndPage(doc) {
  const endPageValue = doc.querySelector(".paginationSet [data-endpage]")?.dataset.endpage;
  const endPage = Number.parseInt(endPageValue || "", 10);

  if (Number.isInteger(endPage) && endPage > 0) {
    return endPage;
  }

  const pageIndexes = [...doc.querySelectorAll(".paginationSet a[href*='pageIndex=']")]
    .map((anchor) =>
      Number.parseInt(
        new URL(anchor.getAttribute("href"), window.location.href).searchParams.get("pageIndex") ||
          "",
        10
      )
    )
    .filter((pageIndex) => Number.isInteger(pageIndex) && pageIndex > 0);

  return Math.max(1, ...pageIndexes);
}

function scrapeHistoryDocument(doc, pageUrl) {
  const table = doc.querySelector(".boardlist .tbl-ovx table");

  if (!table) {
    return [];
  }

  return [...table.querySelectorAll("tbody tr")]
    .map((row) => scrapeHistoryRow(row, pageUrl))
    .filter(Boolean);
}

function scrapeHistoryRow(row, pageUrl) {
  const cells = [...row.querySelectorAll("td")];

  if (cells.length < 10) {
    return null;
  }

  const no = getText(cells[0]);
  const type = getText(cells[1]);
  const titleLink = cells[2].querySelector("a[href]");
  const title = getText(titleLink || cells[2]);
  const mentor = getText(cells[3]);
  const lectureDate = getText(cells[4]);
  const registeredAt = getText(cells[5]);
  const status = getText(cells[6]);
  const approval = getText(cells[7]);
  const answerHistory = getText(cells[8]);
  const note = getText(cells[9]);

  if (!title) {
    return null;
  }

  return {
    url: titleLink
      ? new URL(titleLink.getAttribute("href"), pageUrl).href
      : `${pageUrl}#history-${no || title}`,
    title: type ? `[${type}] ${title}` : title,
    body: createHistoryBody({
      type,
      title,
      mentor,
      lectureDate,
      registeredAt,
      status,
      approval,
      answerHistory,
      note
    }),
    mentor,
    taken_at: parseDateTime(registeredAt) || new Date().toISOString()
  };
}

function createTestHistory(history) {
  const url = `https://${HISTORY_HOST}/sw/mypage/mentoLec/view.do?qustnrSn=${history.id}&menuNo=200046&history=y`;

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
    ["\uac1c\uc124\uc2b9\uc778", history.approval],
    ["\uc811\uc218\ub0b4\uc5ed", history.answerHistory],
    ["\ube44\uace0", history.note]
  ]
    .filter(([, value]) => value && value !== "-")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

function parseDateTime(value = "") {
  const normalized = normalizeText(value);
  const match = normalized.match(
    /(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})(?:\s+(?<hour>\d{1,2}):(?<minute>\d{1,2}))?/
  );

  if (!match?.groups) {
    return null;
  }

  const { year, month, day, hour = "0", minute = "0" } = match.groups;
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function dedupeHistories(histories) {
  const uniqueHistories = [];
  const seenUrls = new Set();

  for (const history of histories) {
    if (!history.url || seenUrls.has(history.url)) {
      continue;
    }

    seenUrls.add(history.url);
    uniqueHistories.push(history);
  }

  return uniqueHistories;
}

function isAllowedPageUrl(url) {
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

function isSameUrl(left, right) {
  const leftUrl = new URL(left);
  const rightUrl = new URL(right);
  return leftUrl.href === rightUrl.href;
}

function getText(element) {
  return normalizeText(element?.textContent || "");
}

function normalizeText(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}
