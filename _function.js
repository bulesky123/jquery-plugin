/**
 * Created by zhoufei on 2016/12/29.
 */
var _function = {
    DX: function (num) {
        ///<summery>小写金额转化大写金额</summery>
        if(isNaN(num))return "无效数值！";
        var strPrefix="";
        if(num<0)strPrefix ="(负)";
        num=Math.abs(num);
        if(num>=1000000000000)return "无效数值！";
        var strOutput = "";
        var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
        var strCapDgt='零壹贰叁肆伍陆柒捌玖';
        num += "00";
        var intPos = num.indexOf('.');
        if (intPos >= 0){
            num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
        }
        strUnit = strUnit.substr(strUnit.length - num.length);
        for (var i=0; i < num.length; i++){
            strOutput += strCapDgt.substr(num.substr(i,1),1) + strUnit.substr(i,1);
        }
        return strPrefix+strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
    },
    DateFormat:function (date, format) {
        //传入的format  'yyyy-MM-dd hh:mm:ss';
        date = new Date(Number(date*1000));
        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        format = format.replace(/([yMdhmsqS])+/g, function(all, t){
            console.log(all);//匹配到的字符串
            console.log(t);//正则中的匹配值
            var v = map[t];
            if(v !== undefined){
                if(all.length > 1){
                    v = '0' + v;
                    v = v.substr(v.length-2);
                }
                return v;
            }
            else if(t === 'y'){
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    },
    priceFormat:function(num){
        return Number(num).toFixed(2);
    }
};