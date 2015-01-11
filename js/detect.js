/* globals chrome */
'use strict';
var message= document.querySelector('#message font b');
var headerimage = document.querySelector('#headerimage');

if(message !== null && headerimage !== null){
    /* The page is blocked, send hostname to background and after response reload */
    console.log('Page is blocked');
    chrome.extension.sendMessage({host : window.location.hostname}, function(response) {
        if('redirect' in response){
            console.log('REDIRECT', response.redirect);
            window.location.href = response.redirect;
        }else if('reload' in response){
            console.log('Will Reload');
            window.location.reload();
        }
    });
}
