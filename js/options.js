/* globals $, chrome */
$(function(){
    'use strict';
    var proxyman = {};
    if('proxyman' in localStorage){
        proxyman = JSON.parse(localStorage.proxyman);
    }
    /* Read Chrome Proxy Settings and activate*/
    if('mode' in proxyman){
        $('#' + proxyman.mode).attr('checked', 'checked');
        if( proxyman.mode === 'custom_proxy'){
            $('#proxy_type').val(proxyman.type);
            $('#hostname').val(proxyman.host);
            $('#port').val(proxyman.port);
        }
    }else{
        $('#system_proxy').attr('checked', 'checked');
    }

    $('.nav li').on('click', function(){
        $('.nav .active').removeClass('active');
        $(this).addClass('active');
        $('.container > section').hide();
        $('.' + $(this).data('tab')).show();
    });

    if('blockedSites' in proxyman){
        $('.sites-blocked textarea').html(proxyman.blockedSites.join('\n'));
    }
    $('form').on('submit', function(){
        proxyman.mode = $('input[type=radio]:checked').val();
        if( proxyman.mode === 'custom_proxy'){
            proxyman.type = $('#proxy_type').val();
            proxyman.host = $('#hostname').val();
            proxyman.port = $('#port').val();
        }
        localStorage.proxyman = JSON.stringify(proxyman);

        chrome.extension.sendMessage({'refresh_config' : true}, function(response) {
            console.log(response.status);
        });
        $('.alert-success').fadeIn();
        return false;
    });

    $('#reset').on('click', function(){
        if(window.confirm('Are you sure want to reset all settings?')){
            localStorage.removeItem('proxyman');
        }
        window.location.reload();
    });
});
