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

function get_news_status_from_score(score, ml_score) {
    if(ml_score > 75) {
        "fake";
    }

    if(score < 30) {
        return "true";
    }

    if(score < 80) {
        return "mostly-true";
    }

    if(score < 100) {
        return "mostly-fake";
    }
    return "fake";
}

function get_grammar_offset(grammar_mismatch) {
    if(grammar_mismatch < 10) {
        return 0;
    }
    if(grammar_mismatch < 20) {
        return 5;
    }
    if(grammar_mismatch < 30) {
        return 10;
    }
    if (grammar_mismatch < 40) {
        return 15;
    }
    if(grammar_mismatch < 60) {
        return 20;
    }
    return 25;
}


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
            console.log(response.grammar_mismatch);
            console.log(response.total_reports);
            console.log(response.ml_score);
            var grammar_offset = get_grammar_offset(response.grammar_mismatch);
            var score = response.total_reports * 10 + response.ml_score * 100 + grammar_offset;
            var news_status = get_news_status_from_score(score, response.ml_score);
            chrome.browserAction.setIcon({
                path : "icons/" + news_status + ".png",
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