// Initialize button with user's preferred color
let statusButton = document.getElementById("status-button");

// The body of this function will be executed as a content script inside the
// current page
async function getJirasText() {
  const getStorageData = key =>
    new Promise((resolve, reject) =>
      chrome.storage.sync.get(key, result =>
        chrome.runtime.lastError
          ? reject(Error(chrome.runtime.lastError.message))
          : resolve(result)
      )
    );
  let message = 'No statuses selected.. why? :(';
  const { statuses } = await getStorageData('statuses');
  if (statuses && statuses.length) {
    let statusesDom = [...document.getElementsByTagName('h6')]
      .filter((item) => statuses.includes(item.innerHTML));
    let ids = statusesDom.map(item => item.offsetParent.dataset['id']);
    let issues = [];
    for (let id of ids) {
      document.querySelectorAll(`li[data-column-id='${id}'] .ghx-issue-fields`)
        .forEach((item) => {
          issues.push(
            item.querySelector('.ghx-key-link-project-key').innerHTML
            + item.querySelector('.ghx-key-link-issue-num').innerHTML
            + ': '
            + item.querySelector('.ghx-summary .ghx-inner').innerHTML
          )
        });
    }
    message = issues.flat().join("\n");
  }
  const port = chrome.extension.connect({
    name: "Sample Communication"
  });
  port.postMessage(message);
}

// When the button is clicked, check selected statuses and get data
statusButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const statuses = [...document.getElementsByName('status[]')]
    .filter( item => item.checked)
    .map( item => item.value);
  chrome.storage.sync.set({statuses});
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getJirasText,
  });
});

chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function(msg) {
    document.getElementById('qa-list-textarea').innerHTML = msg;
  });
})