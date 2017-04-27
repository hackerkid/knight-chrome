function fetch_article_info(url) {
    chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: 'http://localhost:5000/api/article/info',
        data: "url=" + url
    }, function(responseText) {
        console.log(responseText);
    });
}

fetch_article_info(window.location.href);

