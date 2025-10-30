function FindProxyForURL(url, host) {
    // === DEBUG LOG ===
    var debugMode = false; // set to false to disable debug alerts

    if (debugMode) {
        alert("PAC called for: " + host + " (URL: " + url + ")");
    }

    // === PROXY SETTINGS ===
    var YOUTUBE_PROXY_1 = "PROXY 85.117.62.78:8080";
    var YOUTUBE_PROXY_2 = "PROXY 192.168.1.23:80";
    var TWITTER_PROXY = "PROXY 192.168.1.23:80; DIRECT";

    // === FAILOVER CONTROL ===
    var ENABLE_YT_FAILOVER = true; // set to false to disable proxy failover

    // === DOMAIN LISTS ===
    var youtubeDomains = [
        "youtube.com","m.youtube.com","youtube-nocookie.com",
        "youtu.be","googlevideo.com","ytimg.com","ggpht.com",
        "gstatic.com","static.doubleclick.net"
    ];
    var twitterDomains = [
        "x.com","twitter.com","t.co","api.t.co","twimg.com",
        "ads-twitter.com","pscp.tv","twtrdns.net","twttr.com",
        "twitterinc.com","cms-twdigitalassets.com","api.twitter.com",
        "upload.twitter.com","cdn.twitter.com","abs.twimg.com",
        "video.twitter.com","syndication.twitter.com","analytics.twitter.com",
        "caps.twitter.com","chatgpt.com","flibusta.is"
    ];

    // === UNIVERSAL HOST MATCH FUNCTION ===
    function matchHostList(list, host) {
        for (var i = 0; i < list.length; i++) {
            var domain = list[i];
            if (dnsDomainIs(host, domain) || shExpMatch(host, "*." + domain)) {
                if (debugMode) alert("Matched domain: " + host + " -> " + domain);
                return true;
            }
        }
        return false;
    }

    // === DIRECT EXCLUDE LIST ===
    var directStr =
        "10.*,172.16.*,172.17.*,172.18.*,172.19.*,172.20.*,172.21.*,172.22.*,172.23.*,172.24.*,172.25.*,172.26.*,172.27.*,172.28.*,172.29.*,172.30.*,172.31.*,192.168.*,169.254.*,[fc*],[fd*],[fe8*],[fe9*],[fea*],[feb*],app.diagrams.net,*.ozon.ru,*.ozone.ru,ozone.ru,*.google.com,*.google.ru,translate.google.com,*.figma.com,*.kpfr.club,*.obrut.show,*.trudvsem.ru,trudvsem.ru,*wikipedia.org,*.gosuslugi.ru,*.elektro.ru,*.lemanapro.ru,*.diagrams.net,*.ekfgroup.com,*.stihi.ru,*.svyazon.ru,*.nperf.com,ru-mi.com,*.vk.com,*.dzen.ru,*.dzeninfra.ru,*.kremlin.ru,*.habr.com,*.hh.ru,*.atlassian.net,*.rconf.ru,*.chefmarket.ru,*.dom.ru,dom.ru,*.partizany.by,*.zagonkov.gb.net,pypi.org,*.pypi.org,files.pythonhosted.org,*.pythonhosted.org,*.habr.com,habr.com,habrastorage.org,*.habrastorage.org,tornado.nsk.ru,dns-shop.ru,*.dns-shop.ru,novosibirsk.hh.ru,docs.docker.com,codecguide.com,*.codecguide.com,soulagency.ru,*.soulagency.ru,cdn.jsdelivr.net,*.jsdelivr.net,shedevrum.ai,efset.org,*.efset.org,music.yandex.ru,*.yandex.ru,*.ya.ru,ya.ru,ok.ru,*.ok.ru,web.whatsapp.com,*.whatsapp.com,*.cursor.com,*.bambulab.com,github.com,*.github.com,release-assets.githubusercontent.com,*.githubusercontent.com,cults3d.com,*.cults3d.com,ru.download.nvidia.com,wiki.yandex.ru,*.yandex.ru,yandex.ru,mc.yandex.ru,avatars.mds.yandex.net,mds.yandex.net,*.yandex.net,yandex.net,wiki.yandex.ru,yastatic.net,id.yandex.ru,telemost.360.yandex.ru,*.360.yandex.ru,360.yandex.ru,music.yandex.ru,tracker.yandex.ru";
    var directList = directStr.split(",");

    // === UNIVERSAL DIRECT MATCH FUNCTION ===
    function matchDirectList(host) {
        for (var i = 0; i < directList.length; i++) {
            var pattern = directList[i].replace(/^\s+|\s+$/g, '');
            if (shExpMatch(host, pattern)) {
                if (debugMode) alert("Direct match: " + host + " -> " + pattern);
                return true;
            }
        }
        return false;
    }

    // === MAIN ROUTING LOGIC: EXCEPTIONS FIRST ===
    if (matchDirectList(host)) {
        if (debugMode) alert("Routing " + host + " directly (bypassing proxy)");
        return "DIRECT";
    }

    // === YOUTUBE PROXY BLOCK ===
    if (matchHostList(youtubeDomains, host)) {
        var ytReturn;
        if (ENABLE_YT_FAILOVER) {
            ytReturn = YOUTUBE_PROXY_1 + "; " + YOUTUBE_PROXY_2 + "; DIRECT";
            if (debugMode) alert("YouTube: using failover (" + YOUTUBE_PROXY_1 + " -> " + YOUTUBE_PROXY_2 + ")");
        } else {
            ytReturn = YOUTUBE_PROXY_1 + "; DIRECT";
            if (debugMode) alert("YouTube: using single proxy (" + YOUTUBE_PROXY_1 + ")");
        }
        return ytReturn;
    }

    // === TWITTER PROXY BLOCK ===
    if (matchHostList(twitterDomains, host)) {
        if (debugMode) alert("Twitter/X: routing to " + TWITTER_PROXY);
        return TWITTER_PROXY;
    }

    // === DEFAULT: DIRECT ROUTING FOR ALL OTHER SITES ===
    if (debugMode) alert("Default routing for " + host + " directly");
    return "DIRECT";
}
