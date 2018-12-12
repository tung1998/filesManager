var adminPageData={
    status:0
};


function showCreateAdminForm() {
    $("#CreateAdmin").show();
}

$("#formOutside").click(()=>{
    $("#CreateAdmin").hide();
})

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

