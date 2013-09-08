'use strict';
var chrome = chrome || {};
/*
    proxyman = {
        proxy: direct, auto_detect, pac_script, fixed_servers, system
        blocked_sites: [array of websites]
    }
*/
var proxyman;
if('proxyman' in localStorage){
    proxyman = JSON.parse(localStorage.proxyman);
}else{
    proxyman = {};
}

chrome.proxy.settings.get({}, function(config) {
    console.log('Proxy Settings', config);
});

function changeProxy(config){
    //console.log(config);
    chrome.proxy.settings.set(
    {value: config, scope: 'regular'},
    function() {});
}

/* Creating data for Pacfile */
function genConditions(arr){
    var str ='';
    if(arr.length){
        arr.forEach(function(e,i){
            if(i === arr.length - 1){
                str+= 'host == "'+ e +'"';
            }else{
                str+= 'host == "'+ e +'" || ';
            }
        });
      str = 'if (' + str + '){ return "' + proxyman.type + ' ' + proxyman.host + ':' + proxyman.port + '";}';
    }
    return str;
}
function getConfig(){
    return {
            mode: 'pac_script',
            pacScript: {
                data: 'function FindProxyForURL(url, host) {' + genConditions(proxyman.blockedSites) + '}'
            }
        };
}

chrome.extension.onMessage.addListener(
function(request, sender, sendResponse) {
    proxyman.blockedSites = proxyman.blockedSites || [];
    if( ('host' in request) && proxyman.blockedSites.indexOf(request.host) === -1 ){
        if(proxyman.type === 'redirect'){
            sendResponse({'redirect': proxyman.host + request.host});
        }else{
            proxyman.blockedSites.push(request.host);
            localStorage.proxyman = JSON.stringify(proxyman);
            changeProxy(getConfig());
            sendResponse({'reload': true});
        }
    }

    //console.log(getConfig());
    //sendResponse({'alreadySet': alreadySet, status: 'Proxy changed Successfully'});

    if('refresh_config' in request){
        proxyman = JSON.parse(localStorage.proxyman);
        sendResponse({'status': 'Thanks refreshed'});
    }
});
