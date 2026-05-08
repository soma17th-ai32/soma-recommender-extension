chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "GET_PAGE_CONTEXT") {
    return;
  }

  sendResponse({
    title: document.title,
    body: document.body?.innerText?.slice(0, 2000),
    url: window.location.href
  });
});
