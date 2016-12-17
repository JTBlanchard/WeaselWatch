function setActive(tabID) {
    console.log('Weaselwatch is active in tab' + tabID)
    return
}

function setInactive(tabID) {
    console.log('Weaselwatch is inactive in tab' + tabID)
    return
}

// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {
//    chrome.tabs.executeScript({ file: 'mark.min.js' })
//    chrome.tabs.executeScript({ file: 'weaselwatch.js' })

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id, 
            {greeting: "weaselwatch_toggle"}, 
            function(response) {
                console.log(response.farewell);
            }
        )
    })
})

chrome.tabs.onActivated.addListener(function(tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {greeting: "weaselwatch_check_active"},
            function(response) {
                console.log(response.farewell);
                if (response.farewell === true)
                    setActive(tabs[0].id)
                else
                    setInactive(tabs[0].id)
            }
        )
    })
})
