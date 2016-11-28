/**
 * Created by zhoufei on 2016/11/25.
 */
function createHtml(param){
    var html='';
    html+='<div id="'+param.id+'" class="shade '+param.clazz+'">' +
    '<div class="dialog flex-box flex-align flex-center">' +
    '<div class=" t_c">' +
    ''+ (param.closeBar ? '<div class="clearfix"><div class="bar"></div></div>' : '')+
    '<div class="content">'+param.content+'' +
    '<p class="button">你好</p>' +
    '</div>' +
    ''+param.element+'' +
    '</div>' +
    '</div>'+
    '</div>';
    return html;
}
function Dialog(parmars) {
    var that =this;
    var contentHtml=parmars.content;
    var elementHtml=parmars.element || "";
    if(contentHtml.substr(0,1)=="#"){
        contentHtml =$(parmars.content).css('display','block').prop('outerHTML');
        $(parmars.content).remove();
    }

    if(elementHtml.substr(0,1)=="#"){
        elementHtml =$(parmars.element).prop('outerHTML');
        $(parmars.element).remove();
    }
    this.content = $(createHtml({
        content:contentHtml,
        clazz:parmars.clazz || 'temp',
        id:parmars.id || '',
        closeBar:parmars.closeBar,
        shade:parmars.shade || '',
        element:elementHtml
    })).appendTo($("body"));

    this.close = parmars.close || this.hide;
    this.load = parmars.load || $.noop;
    this.closebar = this.content.find('.bar');
    this.closebar.on('click',$.proxy(function(){
        this.close();
    },this));
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