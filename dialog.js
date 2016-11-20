/**
 * Created by alei on 2016/2/25.
 */
var common_tmpl = require('../template/common_tmpl');
template.config("escape", false);
var config = require('./config');
var ajax = require('./ajax');
var render = template.compile(common_tmpl.dialog);
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
    this.content = $(render({
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

var load;
var loading = function () {
    if(!load){
        load=new Dialog({
            content:'#loading',
            clazz:'loading'
        });
    }
    return load;
};
var tradepwd;
var setPwd=function(pwd){
    var load = new Dialog({
       content:'<div style="background-color: #ffffff;padding: 10px;">请稍后...</div>'
    });
    tradepwd.hide();
    load.show();
    //未设置交易密码
    ajax.req({
        data: {password: pwd},
        url: 'user/updateUserPassword',
        success: function (data) {
            load.clear();
            if (data.status == 0) {
                config.userstatus.pwdFlag = "1";
                tradepwd.hide();
                toast('密码设置成功！');
                tradepwd.success && tradepwd.success();
            }else if(data.status == 19113){//已经有密码（直接到输入交易密码）
                tradepwd.hide();
                toast(data.message);
                config.userstatus.pwdFlag = "1";
                tradepwd.success && tradepwd.success();
            }else{
                tradepwd.hide();
                toast(data.message);
            }
        }
    });
};
var Tradepwd = function () {
    if(!tradepwd){
        tradepwd = dialog({
            clazz: 'cache',
            content: '#pwdbox',
            element: '#keyword',
            close:function(){
                this.content.hide();
                tradepwd.content.find("#keyword").css('bottom', "-8rem");
            }
        });
        tradepwd.pwd="";
        var temp="";

        tradepwd.title=function(title){
            tradepwd.content.find("#pwdbox .tit").text(title);
        };
        tradepwd.clear=function(){
            tradepwd.pwd="";
            temp="";
            tradepwd.content.find("#pwdbox li").html("");
        };
        tradepwd.setname=function(name){
            tradepwd.content.find("#pwdbox .name").text(name);
        };
        tradepwd.price=function(price){
            if(price){
                tradepwd.content.find("#pwdbox .price").text("¥"+price+"元");
            }
        };
        tradepwd.hide=function(){
            this.content.hide();
            tradepwd.content.find("#keyword").css('bottom', "-8rem");
        };

        tradepwd.show=function(price){
            alert(config.userstatus.pwdFlag);
            if (config.userstatus.pwdFlag=="1") {
                this.title("请输入交易密码");
                this.setname("支付金额");
                this.price(price);
            }else{
                this.title("请设置交易密码");
            }
            this.clear();
            this.content.show();
            setTimeout(function () {
                tradepwd.content.find("#keyword").css('bottom', 0);
            }, 50);
        };
        $(document).on('touchstart','#keyword .num',function(){
            var that =$(this);
            if(that.hasClass('delkey')){
                temp = temp.substr(0,temp.length-1);
                tradepwd.content.find("#pwdbox li").eq(temp.length).html("");
                return;
            }
            if(that.hasClass('disabled')){
                return;
            }
            temp+=this.innerText;
            var len =temp.length;
            tradepwd.content.find("#pwdbox li").eq(len-1).html('<span></span>');
            if(len>=6){
                //如果有交易密码
                if (config.userstatus.pwdFlag=="1") {
                    tradepwd.pwd=temp;
                    tradepwd.hide();
                    tradepwd.complete && tradepwd.complete(tradepwd.pwd);
                    return;
                }else{
                    if(tradepwd.pwd==""){
                        var firstPwd =temp;
                        tradepwd.clear();
                        tradepwd.pwd =firstPwd;
                        tradepwd.title("请再次确认密码");
                        return;
                    }
                    if(tradepwd.pwd == temp){
                        setPwd(temp);
                    }else{
                        toast("两次密码不一致");
                        tradepwd.title("请设置交易密码");
                        tradepwd.clear();
                    }
                }
            }
        });
    }
    return tradepwd;
};

var toast=function(msg,func){
  var toast =new Dialog({
      content:'<div class="toast">'+msg+'</div>',
      shade:'none',
      clazz:'toast'
  });
    toast.show();
    setTimeout(function(){
        toast.clear();
        func && func();
    },3000);
};



var dialog = function(params){
    return new Dialog($.extend({closeBar:true},params));
};
var Confirm = function(params){
    var html = template('confirm', params);
    var id="confirm"+new Date().valueOf();
    var confirmdialog = dialog({
        id:id,
        content:html
    });
    $("#"+id).touch('.btnbox p',function(e){
        params.btns[$(e.target).attr("btnNum")].click.apply(confirmdialog);
    });
    return confirmdialog;
};

module.exports = {
    constructor:Dialog,
    dialog:dialog,
    Confirm:Confirm,
    loading: loading,
    toast:toast,
    Tradepwd:Tradepwd
};