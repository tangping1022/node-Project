$("#btnAdds").click(function () {
    $(".loginAdd").show();
})

function btnUpdate(i) {
    var id = $(i).parent().parent().find(".id").html().trim();
    var pName = $(i).parent().parent().find(".pName").html().trim();
    var pBrand = $(i).parent().parent().find(".pBrand").text().trim();
    var pBrandHtml = $(i).parent().parent().find(".pBrand").html().trim();
    var pGuided = $(i).parent().parent().find(".pGuided").html().trim();
    var pPrice = $(i).parent().parent().find(".pPrice").html().trim();
    $(".phoneName").val(pName);
    $("#brand option[value=" + pBrand + "]" + pBrandHtml + "").attr("selected", true);

    $(".guided").val(pGuided);
    $(".price").val(pPrice);
    $(".pId").val(id);
    $(".loginUpdate").show();
}

$("#btnClose").click(function () {
    $(".loginAdd").hide();
})
$("#btnCloseUpdate").click(function () {
    $(".loginUpdate").hide();
})

// select 下拉框取值
$(function () {
    $.get("/users/getSelect", function (res) {
        var str = "";
        var list = res.list;
        for (var i = 0; i < list.length; i++) {
            str += "<option  value=\"" + list[i].bValue + "\" >" + list[i].brandName + "</option>";
        }
        $(".form-select").html(str);
    })
})