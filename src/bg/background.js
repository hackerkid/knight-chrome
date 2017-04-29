chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            callback(xhttp.responseText);
        };
        xhttp.onerror = function() {
            callback();
        };
        xhttp.open(method, request.url, true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhttp.send(request.data);
        return true;
    }
});

function set_icon(tab) {
    var url = tab.url;
    console.log(url);
    var http = new XMLHttpRequest();
    var api_url = "http://localhost:5000/api/article/info";
    var params = "url=" + url;
    http.open("POST", api_url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
            var response = JSON.parse(http.responseText);
            chrome.browserAction.setIcon({
                path : "icons/" + response.news_status + ".png",
                tabId: tab.id
            });
        }
    }
    http.send(params);
}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        set_icon(tab);
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    set_icon(tab);
});