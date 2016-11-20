/**
 * Created by alei on 2015/12/15.
 */
(function ($) {
    var tmpl = template;
    //标题表格的模板
    var titletmpl = '<div  class="zz-table-head">' +
        '<table class="datagrid" cellspacing="0" cellpadding="0" border="0">' +
        '<tr style="height: 0;">' +
        '<%for(var i=0,len=column.length;i<len;i++){%>' +
        '<td style="width:<%=column[i].width%>"></td>' +
        '<%}%>' +
        '</tr>' +
        '<tr>' +
        '<%for(var j=0,len=column.length;j<len;j++){%>' +
        '<td><div class="zz-grid-headerCell-outer <%=column[j].class%>"> <div class="zz-grid-title">' +
        '<%=#column[j].title%>' +
        '</div><div id="1" class="zz-grid-column-splitter"></div></div></td>' +
        '<%}%>' +
        '</tr>' +
        '</table><div class="zz-grid-topRightCell"></div></div>';
    //分页的模板
    var pagetmpl = $('<div class="zz-page-html"></div>');
    //分页的数字模板
    var pageNumtmpl =
        '<select class="selectPageSize">' +
        '<%for(var s=0;s<select.length;s++){%>' +
        '<%if(defaultSelect==select[s]){%>' +
        '<option value="<%=select[s]%>" selected = "selected"><%=select[s]%></option>' +
        '<%}else{%>' +
        '<option value="<%=select[s]%>"><%=select[s]%></option>' +
        '<%}}%>' +
        '</select>'+
        '<div class="navigation">' +
        '<ol class="wp-paginate">' +
        '<%if(current==1){%>' +
        '<li><span href="javascript:void(0);"  pageTo="<%=current%>" class="page prev zz-ico">&#xf07d;</span></li>' +
        //'<li><span class="page current"><%=current%></span></li>' +
        '<%}else{%>' +
        '<li><a href="javascript:void(0);"  pageTo="<%=current-1%>" class="page prev zz-ico">&#xf07d;</a></li>' +
        '<li><a href="javascript:void(0);" pageTo="1" class="page">1</a></li>' +
        '<li><span class="gap zz-ico">&#xf07e;</span></li>' +
        '<%}%>' +
        '<%for(var i=limit;i<=maxNum;i++){%>' +
        '<%if(current==i){%>' +
        '<li><span class="page current"><%=current%></span></li>' +
        '<%}else{%>' +
        '<li><a href="javascript:void(0);" pageTo="<%=i%>" class="page"><%=i%></a></li>' +
        '<%}}%>' +
        '<%if(current==totalPage){%>' +
        //'<li><span class="page current"><%=totalPage%></span></li>' +
        '<li><span href="javascript:void(0);" pageTo="<%=current%>" class="page next zz-ico">&#xf07f;</span></li>' +
        '<%}else{%>' +
        '<li><span class="gap zz-ico">&#xf07e;</span></li>' +
        '<li><a href="javascript:void(0);" pageTo="<%=totalPage%>" class="page"><%=totalPage%></a></li>' +
        '<li><a href="javascript:void(0);" pageTo="<%=current+1%>" class="page next zz-ico">&#xf07f;</a></li>' +
        '<%}%>' +
        '</ol>' +
        '</div>' +
        '<a href="javascript:void(0);" class="zz-ico zz-refresh">&#xf07a;</a>' +
        '<div class="zz-pager-right">每页 <%=pageSize%> 条,共 <%=total%> 条</div>';
    //表格的内容部分
    var zz_table_body = $('<div  class="zz-panel-body"><div class="zz-table-fluid"></div><div class="zz-loading" style="display: none;"><div class="shade"></div><div class="inner"><i class="zz-ico"></i><span>加载中...</span></div></div></div>');
    $.fn.datagrid = function (opts) {
        //缓存jquery dom 变量
        var self = this,
            main =self.parents(".main"),
            tbody = null,
            load = null,
            header = null,
            Td_w = null;
        opts=$.extend({select:[10,20,100]},opts || {});
        opts = $.extend({
            defaultSelect:opts.select[1],//默认选中的是第一项（20）
            map:"content.rows",
            list:[],
            auto:(self.height() ==main.height())
        },opts);
         var queryParams = $.extend({
                pageNum: 1,    //分页的页码
                pageSize: opts.defaultSelect
            }, opts.queryParams || {},true),
            titleH = 34 + 30,//title  and  pagesize
            menuHeight = 0;//menu and other height
        if(opts.auto){
            self.siblings().each(function () {
                menuHeight += $(this).height();
            });
            self.height(main.height()-menuHeight);
        }
        // 获取table  头
        var getHeader = function () {
            if (header == null) {
                header = self.find('.zz-table-head');
            }
            return header;
        };

        /*
         * 绘制table first tr td width
         * */
        function firstTr() {
            var tr = '<tr style="height: 0">';
            for (var t = 0; t < opts.column.length; t++) {
                var colw = opts.column[t].width || "auto";
                tr += '<td style="width:' + colw + '"></td>';
            }
            tr += "</tr>";
            Td_w = tr;
            return Td_w;
        }

        /*
         * 创建表格 dom元素
         * @params data: 数据源
         */
        var _create = function (data) {
            if (!opts.column) {
                var column = [];
                for (var f in data[0]) {
                    column.push({
                        title: f,
                        field: f,
                        width: opts.width || "auto"
                    });
                }
                opts.column = column;
            }
            var checkIndex=0;
            if(opts.column[0].field=="N"){
                opts.column[0].title="&nbsp;";
                checkIndex=1;
            }
            if(opts.checked){
                opts.column.splice(checkIndex,0,{
                    class:'zz-checkcolumn',
                    title:'<input class="checkAll" type="checkbox" />',
                    width:'30px',
                    formate:function(value,row,index){
                        return '<input index="'+index+'" class="checkbox" type="checkbox" />';
                    }
                })
            }
            var render = tmpl.compile(titletmpl);
            var html = render({
                column: opts.column
            });
            self.html(html);
            var zz_table_fluid = '<table class="datagrid" cellspacing="0" cellpadding="0" border="0"></table>';
            zz_table_body.height(self.height() - titleH);
            zz_table_body.find('.zz-table-fluid').html(zz_table_fluid);
            self.append(zz_table_body);
            //分页
            self.append(pagetmpl);
        };

        /*
         * 根据是否显示滚动条来设置head table 的宽度设置
         * */
        function _refreshCss(elem) {
            var tb_head =getHeader();   //获取table 的头部
            //var clientW = elem.clientWidth || (elem.documentElement && elem.documentElement.clientWidth);
            var scrollW = elem.scrollWidth || (elem.documentElement && elem.documentElement.scrollWidth);
            var scrollH = elem.scrollHeight || (elem.documentElement && elem.documentElement.scrollHeight);
            var clientH = elem.clientHeight || (elem.documentElement && elem.documentElement.clientHeight);
            if (scrollH > clientH) {
                tb_head.find("table").width(scrollW);
            } else {
                tb_head.find("table").width("100%");
            }
        }

        /*
         * 根据data数据重新刷新表格数据，渲染分页
         * @params:data -> ajax 请求过来的数据
         * */
        function RenderTable(data) {
            var listkey = opts.map.split('.');
            var rows = (function(){
                var list =data;
                for(var i=0;i<listkey.length;i++){
                    list=list[listkey[i]]
                }
                return list;
            })(data);
            opts.list=rows;
            if(rows.length==0){
                if(tbody){
                    tbody.html('<tr><td style="text-align: center" rowspan="'+opts.column.length+'">没有相关数据！</td></tr>');
                }else{
                    self.html("没有相关数据！");
                }

                return;
            }
            if (!tbody && !opts.column) {
                //绘制表格头
                _create(rows);
            }
            var column = opts.column,
                zz_table_grid = Td_w || firstTr();
            for (var i = 0, len = rows.length; i < len; i++) {
                var row = rows[i];
                zz_table_grid += '<tr>';
                (function (index) {
                    for (var j = 0; j < column.length; j++) {
                        //if: 序号
                        if (column[j].field == "N") {
                            var val = (queryParams.pageNum - 1) * queryParams.pageSize + index + 1;
                            zz_table_grid += '<td class="zz-table-N"><div>' + val + '</div></td>';
                        } else {
                            var val = rows[i][column[j].field] || "";
                            if (column[j].formate) {
                                val = column[j].formate(val, rows[i], index);
                            }
                            zz_table_grid += '<td><div class="'+column[j].class+'">' + val + '</div></td>';
                        }
                    }
                })(i);
                zz_table_grid += '</tr>';
            }
            tbody = tbody || self.find('.zz-table-fluid .datagrid');
            tbody.html(zz_table_grid);

            //刷新滚动条
            _refreshCss(zz_table_body[0]);
            //重新渲染 分页
            var pageNumstr = [],
                current = queryParams.pageNum,
                total = data.content.total,
                pagesize = queryParams.pageSize,
                totalPage = Math.ceil(total / pagesize),
                limit = 1,
                maxNum =totalPage;

            if(current>5){
                limit=current-4;
            }else if((current+5)<maxNum){
                maxNum = current+5;
            }

            var pagetmplstr = tmpl.compile(pageNumtmpl);
            var pageHtmlstr = pagetmplstr({
                total: total,
                pageSize: pagesize,
                totalPage: totalPage,
                current: current,
                limit:limit,
                maxNum :maxNum,
                select:opts.select,
                defaultSelect:opts.defaultSelect
            });
            pagetmpl.html(pageHtmlstr);
        }
        /*  根据索引获取数据 */
        self.getValue=function(index){
            if(index){
                return opts.list[index];
            }else{
                return opts.list;
            }

        };

        /* 刷新数据 */
        self.refresh = function (options) {
            zz_table_body.scrollTop(0);
            load = load || zz_table_body.find('.zz-loading');
            load.css({'display': 'block'});
            // 如果自定义列头，提前渲染  看上去更顺畅
            if (opts.column && !tbody) {
                _create();
            }
            var dtd = $.Deferred(); //在函数内部，新建一个Deferred对象
            var postData = $.extend(queryParams, options || {},true);
            $.ajax({
                type: 'POST',
                url: (opts.url || self.attr('url')),
                data: queryParams,
                dataType: 'json',
                success: function (data) {
                    RenderTable(data);
                    dtd.resolve();
                },
                error: function (a, b, c) {
                    console.log(a.status);
                    console.log(a.readyState);
                    console.log(b);
                    dtd.reject();
                },
                complete: function () {
                    load.css({'display': 'none'});
                }
            });
            return dtd.promise(); // 返回promise对象
        };
        /*
         * 渲染数据，绑定事件
         * */
        var _init = function () {
            $.when(self.refresh())
                .done(function () {
                    var elem = zz_table_body[0],
                        tbhead =getHeader(),
                        fluid = zz_table_body.find('.zz-table-fluid');
                    // 横向滚动table  head table 跟随一起滚动
                    var event_type = "scroll",
                        scrollEvent = function (e) {
                            e = e || window.event;
                            var target = e.target || e.srcElement;
                            tbhead[0].scrollLeft = target.scrollLeft || (target.documentElement && target.documentElement.scrollLeft);
                        };
                    if (elem.addEventListener) {
                        elem.addEventListener(event_type, scrollEvent, false);
                    } else if (elem.attachEvent) {
                        elem.attachEvent("on" + event_type, scrollEvent);
                    }
                    //分页按钮点击事件
                    self.on('click', '.navigation a.page', function () {
                        var curpage = $(this).attr("pageTo");
                        self.refresh({pageNum: Number(curpage)});
                    }).on('change','.selectPageSize',function(){
                        var pagesize =$(this).val();
                        opts.defaultSelect = pagesize;
                        self.refresh({pageSize:Number(pagesize),pageNum:1});
                    }).on('click','.zz-refresh',function(){
                        self.refresh();
                    });

                    //浏览器窗口变化事件
                    var timer;
                    window.onresize = function () {
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            if(opts.auto){
                                self.height(main.height()-menuHeight);
                                zz_table_body.height(self.height() - titleH);
                            }
                            _refreshCss(elem);
                        }, 100);
                    };
                    //checked event
                    if(opts.checked){
                        tbhead.on('click','.checkAll',function(){
                            fluid.find('.checkbox').prop('checked',$(this).prop('checked'))
                        });
                        fluid.on('click','.checkbox',function(){
                            if(fluid.find('.checkbox:checked').size()==fluid.find('.checkbox').size()){
                                tbhead.find('.checkAll').prop('checked',true);
                            }else{
                                tbhead.find('.checkAll').prop('checked',false);
                            }
                            var row = self.getValue($(this).attr('index'));
                            self.trigger('checkEvent',[row]);
                        });
                        //获取选择项
                        self.getChecked=function(){
                            var checklist=[];
                            fluid.find('.checkbox:checked').each(function(){
                                checklist.push(self.getValue($(this).attr('index')));
                            });
                            return checklist;
                        }
                    }
                })
                .fail(function () {
                    alert("初始化表格失败！");
                });
        };
        _init();
        self.data("table",self);
        return self;
    };
})(jQuery);