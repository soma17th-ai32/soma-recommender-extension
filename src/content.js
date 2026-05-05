chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "GET_PAGE_CONTEXT") {
    return;
  }

  sendResponse({
    title: document.title,
    url: window.location.href
  });
});
