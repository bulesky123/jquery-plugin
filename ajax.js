(function(){
    var config = require('./config');
    var Url = require("url");
    var dataAcquisition = require('./dataAcquisition');
    //纯净版ajax请求
    var ua=window.navigator.userAgent.toLowerCase();
    var _ajax =function(params){
        return $.ajax({
            url:params.url,
            type: params.type || "POST",
            async: true,
            contentType:params.contentType || 'application/json;charset=UTF-8;',
            data: JSON.stringify(params.data),
            success:function(data){
                if(data.status==7) {
                    if (ua.indexOf("micromessenger") >= 0 || ua.indexOf("windows phone") >= 0) {

                    }else{
                        alert("登录超时，请重新登录");
                        dataAcquisition.relogin();
                        return;
                    }
                }
                params.success&&params.success(data);
            },
            error: function(data){
                if(data.responseText.indexOf('401')>-1){
                    if (ua.indexOf("micromessenger") >= 0 || ua.indexOf("windows phone") >= 0) {

                    }else{
                        alert("登录超时，请重新登录");
                        dataAcquisition.relogin();
                        return;
                    }
                }
                params.error&&params.error(data);
            },
            complete: params.complete || function() {}
        })
    };
    //符合项目参数的get请求
    var _get = function(params){
        params.type = "GET";
        return _ajax(params);
    };
    //符合项目参数的post请求
    var _post = function(params){
        var u =new Url(params.url);
        u.host=config.root;
        u.protocol="";
        u.port="";
        params.url = u.toString();
        return _ajax(params);
    };
    //与微信沟通的请求
    var _req = function(params){
        var u =new Url(params.url);
        u.host=config.root;
        if(config.wechat){
            u.query['u']=config.wechat.userId;
            u.query['t']=config.wechat.userToken;
        }
        if (ua.indexOf("micromessenger") >= 0 || ua.indexOf("windows phone") >= 0) {
            u.query['c']=0;
        }else if(/iphone|ipad|ipod/i.test(ua)){
            u.query['c']=0;
        }else{
            u.query['c']=2;
        }
        u.protocol="";
        u.port="";
        params.url = u.toString();
        params.data = $.extend({userGid:config.wechat && config.wechat.userGid,zuid:config.zuid},params.data);
        return _ajax(params);
    };
    module.exports = {
        _ajax:_ajax,
        _get: _get,
        _post: _post,
        req:_req
    };
})(undefined);