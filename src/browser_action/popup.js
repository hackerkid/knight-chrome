var server_url = chrome.app.getDetails().homepage_url
function report_url(url) {
    chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: server_url + '/api/report/add',
        data: "url=" + url
    }, function(responseText) {
    	document.getElementById("message-from-server").innerHTML = responseText;
    });
}

function fetch_article_info(url) {
    chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: server_url + '/api/article/info',
        data: "url=" + url
    }, function(response) {
        response = JSON.parse(response);
       	document.getElementById("total_reports").innerHTML = "<b>" + response.total_reports + "</b> persons reported this as fake.";
       	document.getElementById("ml_score").innerHTML = "<b>" + response.ml_score * 100 + "%</b> similiar to fake news articles";
       	document.getElementById("summary").innerHTML = response.summary;
       	document.getElementById("grammar_mismatch").innerHTML = "<b>" + response.grammar_mismatch  + "</b> mismatches";
        document.getElementById("status-image").src = "../../icons/" + response.news_status + ".png";
        document.getElementById("more-details").href = server_url + "/info?url=" + url;
    });
}

chrome.tabs.query({active : true, currentWindow: true}, function (tabs) {
    fetch_article_info(tabs[0].url);
});

document.getElementById("report-btn").onclick = function() {
    chrome.tabs.query({active : true, currentWindow: true}, function (tabs) {
        report_url(tabs[0].url);
    });
};
