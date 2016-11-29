/**
 * Created by zhoufei on 2016/11/25.
 */
function createHtml(param){
    var html='';
    html+='<div id="'+param.id+'" class="shade '+param.clazz+'">' +
    '<div class="dialog flex-box flex-align flex-center">' +
    '<div class=" t_c">' +
    ''+ (param.closeBar ? '<div class="clearfix"><div class="bar"></div></div>' : '')+
    '<div class=" contentBox">' +
    '<div class="dialogTitle">'+param.title+'</div>' +
    '<div class="content">'+param.content+'' +
    '</div>' +
    '<div class="buttonBox">'+param.button+'</div>' +
    '</div>' +
    '</div>' +
    '</div>'+
    '</div>';
    return html;
}
function Dialog(parmars) {
    var that =this;
    var contentHtml=parmars.content;
    var buttonArr=parmars.button || [];
    var titleHtml=parmars.title || '';
    var buttonHtml='';
    if(contentHtml.substr(0,1)=="#"){
        contentHtml =$(parmars.content).css('display','block').prop('outerHTML');
        $(parmars.content).remove();
    }
    if(buttonArr.length>0){
        if(buttonArr.length==1){
            buttonHtml='<p class="button" id="_id0">'+buttonArr[0].buttonText+'</p>'
        }else if(buttonArr.length==2){
            buttonHtml='<p class="button '+buttonArr[0].clazz+'" id="_id0">'+buttonArr[0].buttonText+'</p>' +
            '<p class="button border-left '+buttonArr[1].clazz+'" id="_id1">'+buttonArr[1].buttonText+'</p>'
        }else{
            for(var i= 0,len=buttonArr.length;i<len;i++){
                buttonHtml+='<span class="button cehis'+buttonArr[i].clazz+'" id="_id'+i+'">'+buttonArr[i].buttonText+'</span>'
            }
        }
    }
    this.content = $(createHtml({
        content:contentHtml,
        clazz:parmars.clazz || 'temp',
        id:parmars.id || '',
        closeBar:parmars.closeBar,
        shade:parmars.shade || '',
        button:buttonHtml,
        title:titleHtml
    })).appendTo($("body"));
    this.close = parmars.close || this.hide;
    this.load = parmars.load || $.noop;
    this.closebar = this.content.find('.bar');
    this.closebar.on('click',$.proxy(function(){
        this.close();
    },this));
    this.content.find('.button').on('click',function(){
        var arr=parmars.button || [],callback=[],_that=this;
        for(var i=0;i<arr.length;i++){
            callback.push({id:"_id"+i,callback:arr[i].callback})
        }
        $.each(callback,function(i,val){
            if(val.id==_that.id){
                val.callback();
                that.close();
            }
        });
    });
}
Dialog.prototype={
    show:function(){
        this.content.show();
    },
    hide:function(){
        this.content.hide();
    },
    clear:function(){
        this.closebar.unbind('click',this.close);
        this.content.remove();
    },
    set:function(HTML){
        if(HTML.substr(0,1)=="#"){
            document.getElementById(parmars.content.substr(1)).style.display="block";
            HTML =document.getElementById(parmars.content.substr(1)).outerHTML;
        }
        this.content.find(".content").html(HTML);
    }
};
var dialog={
    constructor:function(param){
        Dialog(param)
    },
    dialog:function(params){
        return new Dialog($.extend({closeBar:true},params));
    }
}