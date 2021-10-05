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
  // count story points
  const doneId = [...document.getElementsByTagName('h6')]
    .filter(item => item.innerHTML === 'Done')
    .map(item => item.offsetParent.dataset['id'])
    .pop();
  const qaId = [...document.getElementsByTagName('h6')]
    .filter(item => item.innerHTML === 'In QA')
    .map(item => item.offsetParent.dataset['id'])
    .pop();
  let doneSum = 0, qaSum = 0;
  document.querySelectorAll(`li[data-column-id='${doneId}'] .ghx-card-footer`)
    .forEach((item) => {
      doneSum += +item.querySelector('.ghx-end aui-badge').innerHTML
    });
  document.querySelectorAll(`li[data-column-id='${qaId}'] .ghx-card-footer`)
    .forEach((item) => {
      qaSum += +item.querySelector('.ghx-end aui-badge').innerHTML
    });
  chrome.runtime.sendMessage({type: "sendJiras", message});
  chrome.runtime.sendMessage({type: "sendDoneSum", doneSum});
  chrome.runtime.sendMessage({type: "sendQASum", qaSum});
}

// When the button is clicked, set some
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

chrome.runtime.onMessage.addListener(
  function(message) {
    switch(message.type) {
      case "sendJiras":
        document.getElementById('qa-list-textarea').innerHTML = message.message;
        break;
      case "sendDoneSum":
        document.getElementById('story-points-done').innerHTML = `<br />${message.doneSum} story points you have done<br />`;
        break;
      case "sendQASum":
        document.getElementById('story-points-qa').innerHTML = `${message.qaSum} story points in QA<br />`;
        break;
      default:
        console.error("Unrecognised message: ", message);
    }
  }
);
