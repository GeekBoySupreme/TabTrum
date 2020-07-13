function byAlphabeticalURLOrder(tab1, tab2) {
    if (tab1.url < tab2.url) {
      return -1;
    } else if (tab1.url > tab2.url) {
      return 1;
    }
    return 0;
  }



chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {

    tabs.sort(byAlphabeticalURLOrder);
    
    document.write(`<h3>The tabs you're on are:</h3>`);
    document.write('<ul>');
    for (let i = 0; i < tabs.length; i++) {
      document.write(`<li>${tabs[i].url}</li>`);
    }
    document.write('</ul>');
  });