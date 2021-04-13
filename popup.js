// Initialize button with user's preferred color
/*let statusButton = document.getElementById("status-button");

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
*/

// let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
// tab.onUpdated.addListener( function (tabId, changeInfo, tab) {
//   if (changeInfo.status == 'complete' && tab.active) {
//     console.log('here');
//
//     // do your things
//
//   }
// })
// console.log('wtf');
// let [tab] = chrome.tabs.query({ active: true, currentWindow: true });
// chrome.scripting.executeScript({
//   target: { tabId: tab.id },
//   function: getTicket,
// });
// function getTicket() {
//   console.log('ticket?');
//   document.addEventListener('DOMContentLoaded', function(e) {
//     console.log('here');
//   });
// }
//
// $(document).ready(function(){
// //your code here
//   console.log('here');
// });
//
// chrome.tabs.onUpdated.addListener(function (tabId , info) {
//   console.log('tyt');
//   if (info.status === 'complete') {
//     // your code ...
//     console.log('qwe');
//   }
// });

function getSomeTickets() {
  fetch('https://nonameptz.ru/spec/send_a_log.php?step=1')
  console.log('i am trying');
  let text = document.querySelector('.base__content--pad').textContent.trim();
  if (!text) {
    location.href = 'https://nonameptz.ru/spec/send_a_message.php?type=1'; //error
  }
  if (text.includes("\u0437\u0430\u0431\u0440\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u044b")) {
    fetch('https://nonameptz.ru/spec/send_a_log.php?step=2')
    console.log('shit');
    setTimeout(() => {
      location.reload();
    }, 3*60*1000) // every 3 mins
  } else {
    fetch('https://nonameptz.ru/spec/send_a_log.php?step=3')
    location.href = 'https://nonameptz.ru/spec/send_a_message.php?type=2' //success
  }
}

chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  if (info.status === 'complete' && tab.active) {
    console.log('loaded');
    console.log(tab.url);
    if (tab.url === 'https://tickets.fc-zenit.ru/reserve.php?MATCH_ID=3414994') {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getSomeTickets,
      });
    }
  }
});