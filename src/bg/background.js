var server_url = chrome.app.getDetails().homepage_url
var white_listed_domains = ["google.com", "www.google.co.in", "dropbox.com", "paper.dropbox.com", "stackoverflow.com",
                            "extensions", "chrome.google.com", "knight.vishnuks.com"];

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

function get_host_name(url) {
    var link = document.createElement('a');
    link.setAttribute('href', url);
    return link.hostname;
}

function fetch_info_and_set_icon(tab) {
    var url = tab.url;
    var http = new XMLHttpRequest();
    var api_url = server_url + "/api/article/info";
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
        if (white_listed_domains.indexOf(get_host_name(tab.url)) > -1) {
            chrome.browserAction.setIcon({
                path : "icons/true.png",
                tabId: tab.id
            });
        } else {
            fetch_info_and_set_icon(tab);
        }
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.url) {
         if (white_listed_domains.indexOf(get_host_name(tab.url)) > -1) {
            chrome.browserAction.setIcon({
                path : "icons/true.png",
                tabId: tab.id
            });
        } else {
            fetch_info_and_set_icon(tab);
        }
    }
});