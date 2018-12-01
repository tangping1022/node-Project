var sormSub = false;
var unamReg = /^[a-z]{3,10}$/;
var ageReg = /^(?:[1-9][0-9]?|1[01][0-9]|120)$/;
var username = $(".username");
var password = $(".password");
var passwordend = $(".passwordend");
var nickname = $(".nickname");
var age = $(".age");
//-------------用户名验证-------------
username.focus(function () {
    $("#info_user").show();
    $("#error_user").hide();
})
username.blur(function () {
    //隐藏验证提示信息
    $("#info_user").hide();
    //检测用户名是否合法
    if (unamReg.test(this.value)) { //用户名合法
        sormSub = true;
    } else { //用户名不合法
        //显示不合法的提示信息
        $("#error_user").show();
        sormSub = false;
    }
})
//-------------密码验证-----------------
password.focus(function () {
    $("#info_pwd").show();
    sormSub = false;
})
password.blur(function () {
    $("#info_pwd").hide();
    sormSub = true;

})

// -----------------确认密码--------------------
passwordend.focus(function () {
    $("#info_pwdend").show();
    $("#info_pwdend1").hide();
})
passwordend.blur(function () {
    $("#info_pwdend").hide();
    if ($(".password").val() == $(".passwordend").val()) {
        $("#info_pwdend").hide();
        $("#info_pwdend1").hide();
        sormSub = true;
    } else {
        $("#info_pwdend1").show();
        sormSub = false;
    }
})
// -----------------昵称--------------------
nickname.focus(function () {
    $("#info_nickname").show();
    sormSub = false;
})
nickname.blur(function () {
    $("#info_nickname").hide();
    sormSub = true;
})
// -----------------昵称--------------------
age.focus(function () {
    $("#info_age").show();
    $("#info_age1").hide();
})
age.blur(function () {
    $("#info_age").hide();

    if (ageReg.test(this.value)) { //年龄合法
        $("#info_age").hide();
        $("#info_age1").hide();
        sormSub = true;
    } else {
        $("#info_age1").show();
        sormSub = false;
    }

})
$(".sign-in").click(function () {
    if (sormSub) {
        return true;
    } else {
        return false;
    }
})