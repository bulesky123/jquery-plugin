/**
 * Created by alei on 2015/12/22.
 */
$.fn.tree = function (opts) {
    opts = $.extend({
        dict: {},
        map: "content"
    }, opts || {});
    var queryParams = $.extend({}, opts.queryParams || {}, true);
    var self = this;
    self.isInit = false;
    self.Params =queryParams;
    var deeps = 0;
    var _create = function (data, parent, deep) {
        deeps++;
        var node = {};
        for (var i = 0, len = data.length; i < len; i++) {
            var dp = (deep === 0 ? i : deeps);
            var hasChildren = data[i].children.length > 0,
                checked = data[i].checked ? 'true' : 'false';
            var arrstr = '[' + i + ']';
            if (deep !== 0) {
                arrstr = parent.attr("source") + "[" + i + "]";
            }
            //如果有子元素
            if (hasChildren) {
                data[i].icon=data[i].icon || "ico";
                node = {
                    switch_type: "center",
                    switch_icon: function () {
                        return "switch " + node.switch_type + "_" + (data[i].open ? "open" : "close")
                    },
                    icon: data[i].icon + "_" + (data[i].open ? "open" : "close"),
                    text: data[i].text,
                    chk: opts.checked ? '<span nodetype="parent" source="' + arrstr + '" class="icon chk checkbox_' + checked + '_full"></span>' : ''
                };
                if (len == 1) {
                    node.switch_type = "noline";
                } else if (i == 0) {
                    node.switch_type = "roots";
                } else if (i == (len - 1)) {
                    node.switch_type = "bottom";
                }
                if (opts.checked) {
                    /* 根据children checkobx 选中的个数，判断父级checkbox样式 */
                    var childrenChked = 0, checkboxstyle = 'checkbox_true_part';
                    for (var c = 0; c < data[i].children.length; c++) {
                        if (data[i].children[c].checked) {
                            childrenChked++;
                        }
                    }
                    if (childrenChked == data[i].children.length) {
                        data[i].checked = true;
                        checkboxstyle = "checkbox_true_full";
                    } else if (childrenChked == 0) {
                        checkboxstyle = "checkbox_false_full";
                    }
                    node.chk = '<span nodetype="parent" source="' + arrstr + '" class="icon chk ' + checkboxstyle + '"></span>';
                }
            } else {
                //没有子节点了
                node = {
                    switch_icon: function () {
                        return "center_docu"
                    },
                    icon: data[i].icon || "ico_docu",
                    text: data[i].text,
                    chk: opts.checked ? '<span nodetype="children" source="' + arrstr + '" class="icon chk checkbox_' + checked + '_full"></span>' : ''
                };
                if (i == 0 && deeps == 1) {
                    node.switch_icon = function () {
                        return "roots_docu"
                    };
                } else if (i == (len - 1)) {
                    node.switch_icon = function () {
                        return "bottom_docu"
                    };
                }
            }
            var $node = $('<li><span nodeid="' + data[i].id + '" switch_type="' + node.switch_type + '" class="icon ' + node.switch_icon() + '"></span>' +
            node.chk +
            '<a  href="' + data[i].uri + '" class="node" source="' + arrstr + '">' +
            '<span class="icon ' + node.icon + '"></span>' +
            '<span class="node_name" >' + node.text + '</span>' +
            '</a></li>');
            if (hasChildren) {
                var open = (data[i].open ? "block" : "none");
                if (len == 1 || i == (len - 1)) {
                    var $ul = $('<ul style="display:' + open + ';" source="' + arrstr + '[\'children\']"></ul>');
                } else {
                    var $ul = $('<ul style="display:' + open + ';" class="line" source="' + arrstr + '[\'children\']"></ul>');
                }
                $node.append(_create(data[i].children, $ul));
            }
            opts.dict[data[i].id] = {
                dom: $node,
                data: data[i]
            };
            parent.append($node);
        }
        return parent;
    };

    //重新渲染一课新树，根据传入 data（传入data， 不请求）
    self.reload = function (data) {
        opts.dict = {};
        data = data || opts.data;
        var $tree = $('<ul class="zz-ui-tree"></ul>');
        deeps = 0;
        self.html(_create(data, $tree, 0));
    };
    //清空勾选项
    self.clear = function () {
        self.find('.checkbox_true_full')
            .addClass('checkbox_false_full')
            .removeClass('checkbox_true_full');
    };
    //全选
    self.checkAll = function () {
        self.find('.checkbox_false_full')
            .addClass('checkbox_true_full')
            .removeClass('checkbox_false_full');
    };
    //设置勾选项
    self.checked = function (Ids) {
        var dicts = opts.dict;
        for (var i = 0, len = Ids.length; i < len; i++) {
            dicts[Ids[i]].dom
                .find('.checkbox_false_full')
                .addClass('checkbox_true_full')
                .removeClass('checkbox_false_full');
        }
    };

    //重新渲染一课新树，根据传入 data（传入参数， 再次请求）
    self.refresh = function (options) {
        opts.dict = {};
        var dtd = $.Deferred(); //在函数内部，新建一个Deferred对象
        $.extend(queryParams, options || {}, true);
        $.ajax({
            type: 'POST',
            url: (opts.url || self.attr('url')),
            data: queryParams,
            dataType: 'json',
            success: function (data) {
                var listkey = opts.map.split('.');
                opts.data = (function () {
                    var list = data;
                    for (var i = 0; i < listkey.length; i++) {
                        list = list[listkey[i]]
                    }
                    return list;
                })(data);
                var $tree = $('<ul class="zz-ui-tree"></ul>');
                self.html(_create(opts.data, $tree, 0));
                dtd.resolve(opts.data);
            },
            error: function (a, b, c) {
                if (console) {
                    console.log(a.status);
                    console.log(a.readyState);
                    console.log(b);
                } else {
                    alert("Error: " + a.status + " ！");
                }
                dtd.reject();
            },
            complete: function () {
                //todo: 加载数据的时候 请稍后。。。
            }
        });
        return dtd.promise(); // 返回promise对象
    };
    self.init = function (setting) {
        var options = $.extend({
            params: {},
            loading: $.noop,
            loaded: $.noop
        }, setting || {}, true);
        options.loading();
        $.when(self.refresh(options.params))
            .done(function () {
                options.loaded();
            });
        if (self.isInit) {
            return;
        }
        document.oncontextmenu = function () {
            return false;
        };
        self.on('click', '.node', function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            } else {
                window.event.returnValue = false;
                return false;
            }
            options.click && options.click(eval("opts.data" + $(this).attr("source"), e));
        }).on('mousedown', '.node', function (e) {
            var e = e || window.event;
            self.find(".curSelectedNode").removeClass("curSelectedNode");
            $(this).addClass("curSelectedNode");
            if (e.which == 3) {
                $(".drop-menu").css({"top": e.pageY + "px", "left": e.pageX + "px"})
                    .show();
            } else {
                $(".drop-menu").hide();
            }
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = false;
        }).on('click', '.switch', function () {
            var that = $(this),
                switch_type = that.attr("switch_type"),
                nodeid = that.attr("nodeid"),
                node = opts.dict[nodeid];
            that.siblings("ul").slideToggle(250, function () {
                if (this.style.display == "none") {
                    that.addClass(switch_type + "_close")
                        .removeClass(switch_type + "_open");
                    node.dom
                        .children('.node').children('.icon')
                        .addClass(node.data.icon + "_close")
                        .removeClass(node.data.icon + "_open");

                } else {
                    that.addClass(switch_type + "_open")
                        .removeClass(switch_type + "_close");
                    node.dom
                        .children('.node').children('.icon')
                        .addClass(node.data.icon + "_open")
                        .removeClass(node.data.icon + "_close");
                }
            });
        }).on('click', '.chk', function () {
            var $node = $(this),
                nodetype = $node.attr('nodetype');
            //被点元素状态
            if ($node.hasClass('checkbox_false_full_focus')) {
                $node.addClass("checkbox_true_full_focus")
                    .removeClass('checkbox_false_full_focus');
            } else if ($node.hasClass('checkbox_true_part_focus')) {
                $node.addClass("checkbox_true_full_focus")
                    .removeClass('checkbox_true_part_focus');
            } else if ($node.hasClass('checkbox_true_full_focus')) {
                $node.addClass("checkbox_false_full_focus")
                    .removeClass('checkbox_true_full_focus');
            }
            //子元素状态
            //if (nodetype == "children") {
            //    return;
            //}

            if ($node.hasClass('checkbox_true_full_focus') || $node.hasClass('checkbox_true_part_focus')) {
                $node.siblings('ul')
                    .find('.chk')
                    .addClass('checkbox_true_full')
                    .removeClass('checkbox_false_full')
                    .removeClass('checkbox_true_part');
            } else {
                $node.siblings('ul')
                    .find('.chk')
                    .addClass('checkbox_false_full')
                    .removeClass('checkbox_true_full');
            }

            //根据选择改变父几点选择状态
            $node.parents('ul').each(function () {
                var silblings = $(this).find('.chk').size();
                var checkedNodes = $(this).find('.checkbox_true_full,.checkbox_true_full_focus').size();
                if (checkedNodes == silblings) {
                    $(this).siblings('.chk').attr('class', 'icon chk checkbox_true_full');
                } else if (checkedNodes == 0) {
                    $(this).siblings('.chk').attr('class', 'icon chk checkbox_false_full');
                } else {
                    $(this).siblings('.chk').attr('class', 'icon chk checkbox_true_part');
                }
            });

        }).on('mouseenter', '.chk', function () {
            var $node = $(this);
            if ($node.hasClass('checkbox_false_full')) {
                $node.addClass('checkbox_false_full_focus')
                    .removeClass('checkbox_false_full');
            } else if ($node.hasClass('checkbox_true_full')) {
                $node.addClass('checkbox_true_full_focus')
                    .removeClass('checkbox_true_full');
            } else if ($node.hasClass('checkbox_true_part')) {
                $node.addClass('checkbox_true_part_focus')
                    .removeClass('checkbox_true_part');
            }
        }).on('mouseleave', '.chk', function () {
            var $node = $(this);
            if ($node.hasClass('checkbox_false_full_focus')) {
                $node.addClass('checkbox_false_full')
                    .removeClass('checkbox_false_full_focus');
            } else if ($node.hasClass('checkbox_true_full_focus')) {
                $node.addClass('checkbox_true_full')
                    .removeClass('checkbox_true_full_focus');
            } else if ($node.hasClass('checkbox_true_part_focus')) {
                $node.addClass('checkbox_true_part')
                    .removeClass('checkbox_true_part_focus');
            }
        });
        //获取选择 项(带父节点)
        self.selectNode = function (options) {
            var params = $.extend({
                filter: function () {
                    return true;
                },
                nodetype: 'all'
            }, options || {});
            if (opts.checked) {
                var contain = '.chk.checkbox_true_full,.checkbox_true_part';
                var checkeds = self.find(contain),
                    checkedNode = [];
                checkeds.each(function () {
                    var $this = $(this);
                    if (params.nodetype=='all'|| ($this.attr("nodetype") == params.nodetype)) {
                        var node_data = eval("opts.data" + $this.attr("source"));
                        if (params.filter(node_data, $this)) {
                            checkedNode.push(node_data);
                        }
                    }
                });
                return checkedNode;
            } else {
                var select = self.find('a.curSelectedNode');
                if (select.size() > 0) {
                    var node_data = eval("opts.data" + select.attr("source"));
                    if (params.filter(node_data, select)) {
                        return node_data;
                    }
                }
                return false;
            }
        };
        //获取选择 项(带父节点)
        self.selectChildrenNode = function (options) {
            //获取选择 项(带父节点)
            return self.selectNode({nodetype: "children"});
        };
        //点击其他 移除某种状态
        $(document).on('mousedown', function (e) {
            $(".drop-menu").hide();
        });
        //初始化结束
        self.isInit = true;
    };
    self.data("tree", self);
    return self;
};