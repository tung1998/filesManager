var adminPageData={
    status:0
};


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

