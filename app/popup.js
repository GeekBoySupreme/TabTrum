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
    // chrome.tabs.move(tabs[0].id, {index: 0});

    // for (let i = 0; i < tabs.length; i++) {
    //   chrome.tabs.move(tabs[i].id, {index: i});
    // }

    //var newURL = "http://stackoverflow.com/";
    //chrome.tabs.create({ url: newURL });

    chrome.storage.sync.set({'data' : [{'foo': 'hello', 'bar': 'hi'}, {'foo': 'it', 'bar': 'works'}]}, function() {
        console.log('Settings saved');
      });

     // Read it using the storage API
        chrome.storage.sync.get(['data1'], function(items) {
            try {
                document.write(items.data[1].bar);
            }
            catch(e) {
                document.write(e);
            }
          });    
     
    // document.write(`<h3>The tabs you're on are:</h3>`);
    // document.write('<ul>');
    // for (let i = 0; i < tabs.length; i++) {
    //   document.write(`<li>${tabs[i].title}</li>`);
    // }
    // document.write('</ul>');
  });