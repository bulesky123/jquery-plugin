(function(){
    //纯净版ajax请求
    var _ajax =function(params){
        return $.ajax({
            url:params.url,
            type: params.type || "POST",
            async: true,
            contentType:params.contentType || 'application/json;charset=UTF-8;',
            data: JSON.stringify(params.data),
            success:params.success || function(){},
            error:params.error || function(){},
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
        var paramsData={
            type:'POST'
        };
        params.data = $.extend(paramsData,params.data);
        return _ajax(params);
    };
    var ajax={
        "_ajax":_ajax,
        "_get":_get,
        "_post":_post
    };
})(undefined);