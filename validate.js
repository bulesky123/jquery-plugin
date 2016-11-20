/**
 * Created by alei on 2016/1/12.
 */
var toast = Dialog.toast;
module.exports = function () {
    //表单验证
    var validate={
        //手机号
        phoneReg:function(phone){
            var phone_reg = /^(1[3-9])\d{9}$/;
            return phone_reg.test(phone);
        },
        //身份证
        idcardReg:function(code){
            var idcard_reg = /^[1-9]\d{5}((1[89]|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i;
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            return (city[code.substr(0,2)] && idcard_reg.test(code));
        },
        //验证码
        codeReg:function(rand){
            var objRegExp  = new RegExp('[a-zA-Z0-9]{4}','g');
            return(objRegExp.test(rand));
        },
        //邮箱
        emailReg:function(email){
            var emailExp =/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
            return (emailExp.test(email));
        },
        //必须是整数（int）
        intReg:function(number){
            var intExp = /^-?\d+$/;
            return(intExp.test(number));
        },
        //必须是数字
        floatReg:function(number){
            var floatExp =/^(-?\d+)(\.\d+)?$/;
            return(floatExp.test(number));
        },
        //英文
        englishReg : function(val){
            var engExp =/^[A-Za-z]+$/;
            return(engExp.test(val));
        },
        //中文
        chineseReg : function(val){
            var chnExp =/^[\u0391-\uFFE5]+$/;
            return(chnExp.test(val));
        },
        //CNV2码
        cnv2Reg : function(val){
            var cnvExp = /(^\d{3}$)/;
            return(cnvExp.test(val));
        },
        //银行卡卡号
        cardReg : function(val){
            var cardExp =  /^(\d{16}|\d{19})$/;
            return(cardExp.test(val));
        }
    };
    $.fn.validate=function(){
        var self =this;
        self.on('blur','[validate]',function(){
            checkError.apply(this,[true]);
        });

        self.getErrors=function(){
            var errors=[];
            self.find('[validate]').each(function(){
                var that =this;
                if(!checkError.apply(this)){
                    errors.push($(that).attr('error'));
                }
            });
            return errors;
        };

        //函数
        function range(type,val){
            var input_value = this.value.trim();
            if(!validate[type+'Reg'](input_value)){
                return false;
            }
            var ranges = val.split(',');
            if(ranges.length==1){
                return input_value.length==ranges[0];
            }
            if(ranges.length==2 && ranges[0]!="" && ranges[1]!=""){
                return input_value >= Number(ranges[0]) && input_value <= Number(ranges[1]);
            }else if(ranges.length==2 && ranges[0]=="" && ranges[1]!=""){
                return input_value <= Number(ranges[1]);
            }else if(ranges.length==2 && ranges[0]!="" && ranges[1]==""){
                return input_value >= Number(ranges[0]);
            }
        }
        //验证检测
        function checkError(info){
            var input_value = this.value.trim();
            var regType=$(this).attr('validate');
            var result =true; //默认正确
            /* 基础校验 */
            if(!validate[regType+"Reg"]){
                var key =regType.split(':')[0],
                    val =regType.split(':')[1];
                switch (key){
                    case 'minLength':
                        result = input_value.length>=val;
                        break;
                    case 'maxLength':
                        result = input_value.length<=val;
                        break;
                    case 'int':
                    case 'float':
                        result = range.apply(this,[key,val]);
                        break;

                }
            }else if(!validate[regType+"Reg"](input_value)){
                result = false;
            }
            if(result){
                this.style.border="1px solid transparent"
            }else{
                if(info){
                    if(input_value=="" && $(this).attr("inputType")){
                        toast($(this).attr("inputType") +"不能为空");
                    }else{
                        toast($(this).attr("error") || ($(this).attr("inputType")==null?("请填写正确的"+$(this).attr("inputType")):"校验失败"));
                    }
                }
            }
            return result;
        }
        return self;
    };
};