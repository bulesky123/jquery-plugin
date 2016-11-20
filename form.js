/**
 * Created by alei on 2015/12/18.
 */
var ajax = require("./ajax");
module.exports = function () {
    $.fn.form = function () {
        var self = this;
        var defaultForm = null;
        self.setData = function (data) {
            defaultForm = data;
            var val = '';
            for (var i in data) {
                val = data[i];
                if ($.isArray(val)) {
                    self.find('[name="' + i + '"]').each(function () {
                        for (var i = 0; i < val.length; i++) {
                            if (this.value == val[i]) {
                                this.checked = true;
                            }
                        }
                    });
                } else {
                    var finddom = self.find('[name="' + i + '"]');
                    if (finddom.attr('type') == 'radio') {
                        finddom.each(function () {
                            (this.value == val) && (this.checked = true);
                        })
                    } else {
                        finddom.val(val);
                    }

                }
            }
        };
        self.getData = function () {
            var serializeObj = {};
            var array = self.serializeArray();
            $(array).each(function () {
                if (serializeObj[this.name]) {
                    if ($.isArray(serializeObj[this.name])) {
                        serializeObj[this.name].push(this.value);
                    } else {
                        serializeObj[this.name] = [serializeObj[this.name], this.value];
                    }
                } else {
                    serializeObj[this.name] = this.value;
                }
            });
            return serializeObj;
        };
        self.getformData = function () {
            var serializeObj = {};
            var array = self.serializeArray();
            $(array).each(function () {
                if (serializeObj[this.name]) {
                    serializeObj[this.name] = serializeObj[this.name] + "," + this.value;
                } else {
                    serializeObj[this.name] = this.value;
                }
            });
            return serializeObj;
        };
        self.submit = function (opts) {
            opts || (opts = {});
            var len = arguments.length;
            if (!(len == 1 && $.isPlainObject(opts))) {
                if ($.isFunction(arguments[0])) {
                    opts = {success: arguments[0] || $.noop()}
                } else if (len <= 2 && typeof arguments[0] == "string") {
                    opts = {url: arguments[0], success: arguments[1] || $.noop()}
                } else if (len == 2 && $.isPlainObject(arguments[0])) {
                    opts = {params: arguments[0], success: arguments[1] || $.noop()}
                } else {
                    opts = {url: arguments[0], params: arguments[1], success: arguments[2] || $.noop()}
                }
            }
            return ajax.req({
                url: opts.url || self.attr('url'),
                data: self.getData(),
                success:opts.success
            });
        };
        self.reset = function () {
            self.clear();
            if (defaultForm) {
                self.setData(defaultForm);
            }
        };
        self.clear = function () {
            self.get(0).reset();
        };
        return self;
    };
};