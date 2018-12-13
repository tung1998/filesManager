var adminPageData={
    status:0
};


function showCreateAdminForm() {
    $("#CreateAdmin").show();
}

$("#formOutside").click(()=>{
    $("#CreateAdmin").hide();
})


function createAdminClick() {
    let data={
        fullName:$("#fullName").val(),
        username:$("#id").val(),
        pass:$("#pass").val(),
    }
    if(checkform(data)){
        $.ajax({
            url:'/admin/createAdmin',
            type:'post',
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data) {
                if(data.status){
                    alertify.success('SUCCESS');
                    $("#CreateAdmin").hide();
                    SCGetAdminData();
                }
                else  alertify.error('ERROR');
            }
        });
    }

}

function logout() {
    $.ajax({
        url:'/admin/logout',
        type:'post',
        success: function(data){
            console.log(data)
            location.reload();
        }
    });
}

function checkform(data) {
    if (data.pass != $('#confirm-pass').val()) {
        alertify.error("confirm-pass wrong")
        return 0;
    } else return 1;
}
