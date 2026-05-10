const HISTORY_HOST = "www.swmaestro.ai";
const HISTORY_PATH = "/sw/mypage/userAnswer/history.do";
const HISTORY_MENU_NO = "200047";
const MAX_HISTORY_PAGES = 20;
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
    ["type", history.type],
    ["title", history.title],
    ["author", history.mentor],
    ["lecture_date", history.lectureDate],
    ["registered_at", history.registeredAt],
    ["status", history.status],
    ["approval", history.approval],
    ["answer_history", history.answerHistory],
    ["note", history.note]
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
