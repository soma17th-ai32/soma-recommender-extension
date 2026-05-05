const pageTitle = document.querySelector("#page-title");
const recommendButton = document.querySelector("#recommend-button");
const result = document.querySelector("#result");

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

  const response = await chrome.tabs.sendMessage(tab.id, {
    type: "GET_PAGE_CONTEXT"
  });

  pageTitle.textContent = response?.title || tab.title || "제목 없는 페이지";
}

recommendButton.addEventListener("click", () => {
  recommendButton.disabled = true;
  result.hidden = false;
  result.textContent = "추천 API 연동 전 기본 동작을 확인했습니다.";
  recommendButton.disabled = false;
});

loadPageContext().catch(() => {
  pageTitle.textContent = "현재 페이지 정보를 불러오지 못했습니다.";
});
