function sendMessageToContentScript(message, callback){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		chrome.tabs.sendMessage(tabs[0].id, message, function(response){
				 if(callback) callback(response);
		});
	});
}


chrome.runtime.onInstalled.addListener(function() {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});


chrome.browserAction.onClicked.addListener((e)=>{
	sendMessageToContentScript({act:'inject'},(res)=>{
		console.log(res);
	})
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	let myjs = request.data;
	chrome.tabs.executeScript({
		code: myjs
	});
	sendResponse("background ext ok");
})