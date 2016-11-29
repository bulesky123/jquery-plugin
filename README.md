# 介绍
本demo主要是扩展jquery的一些插件，主要是在工作中用 的form表单 表单验证validate  表格datagrid 封装的ajax 弹出框dialog
#安装
直接git clone 或者下载
#使用
##dialog的使用
var d1=dialog.dialog({  
        closeBar:true,  
        title:'提示',     
        content:"我是内容" ,        
        button:[        
            {   
                "buttonText":'',        
                "callback":function(){},        
                "clazz":""      
            },  
            {   
                "buttonText":'取消',      
                "callback":function(){},        
                "clazz":""      
            }   
        ]       
    }).show();
###set()方法：
    d1.set('更改的内容')
###show()方法:
    d1.show()
###clear()方法：
    d1.clear()
###hide()方法：
    d1.hide()
##_function 使用：
    _function.DX(12.33)  =>壹拾贰元叁角叁分
    _function.DateFormat(1289407948,'yyyy-MM-dd hh:mm:ss') =>  2010-11-11 00:52:28
    _function.priceFormat(10)   => 10.00
#说明
此demo主要是工作过程中用的，公用的
#感谢
感谢所有对插件有 贡献的人
