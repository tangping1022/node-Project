$("#btnSeach").click(function () {
    var nickname = $('.form-control').val();
    if (nickname !== "") {
        $(".ejsTato").hide();
        $(".jsTato").show();
    } else {
        $(".ejsTato").show();
        $(".jsTato").hide();
    }
    $.get("/users/seach", {
        name: nickname
    }, function (res) {
        if (res.code == 0) {
            var str = "";
            var total = "";
            var list = res.userList;
            var currentPage = "";
            for (var i = 0; i < list.length; i++) {
                str +=
                    `
                <tr>
                                <td>
                                       ${ i+1}
                                </td>
                                <td>
                                       ${ list[i].username}
                                </td>
                                <td>
                                        ${list[i].nickname}
                                </td>
                                <td>
                                        ${ i+1}
                                </td>
                                <td>
                                        ${ i+1}
                                </td>
                                <td>
                                    ${parseInt(list[i].isadmin)?'是':'否'}
                                    
                                </td>
                                <td>
                                ${!parseInt(list[i].isadmin)? "<a href='/users/delete?id="+list[i]._id+">' style='color:#3e4b5b'>删除</a>":''}
                                
                                </td>
                            </tr>
                `
            }

            $("tbody").html(str);

            for (var j = 0; j < res.totalpage; j++) {

                total +=
                    `<a href="/users.html?page=<%=i+1%>&pageSize=<%= pageSize %>">
                    ${j+1}</a>`;
                currentPage += res.currentPage == (j + 1) ? 'active' : ''
            }
            $(".jsTato").html(total);
            $(".jsTato").addClass(currentPage);
        } else {
            alert('失败')
        }
    })
})