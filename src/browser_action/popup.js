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

function report_url(url) {
    chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/api/report/add',
        data: "url=" + url
    }, function(responseText) {
    	document.getElementById("message-from-server").innerHTML = responseText;
    });
}

function fetch_article_info(url) {
    chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/api/article/info',
        data: "url=" + url
    }, function(response) {
        response = JSON.parse(response);
       	document.getElementById("total_reports").innerHTML = response.total_reports + " persons reported this as fake";
       	document.getElementById("ml_score").innerHTML = response.ml_score * 100 + " % similiar to fake news articles";
       	document.getElementById("summary").innerHTML = response.summary;
       	document.getElementById("grammar_mismatch").innerHTML = response.grammar_mismatch  + " mismatches";
        var grammar_offset = get_grammar_offset(response.grammar_mismatch);
        var score = response.total_reports * 10 + response.ml_score * 100 + grammar_offset;
        var news_status = get_news_status_from_score(score, ml_score);
        var elm = document.getElementsByClassName("fake-news-status");
        elm[0].classList.add(news_status);
        document.getElementById("more-details").href = "http://localhost:5000/info?url=" + url;
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
